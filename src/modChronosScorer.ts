// Chronos Scorer: Helper for scoring Chronos Solos events.

import { notOnGalaxite, Scores, defaultWeights, sendGXUMessage, getNickname, EventPlayer } from "./exports";
import { api, GameName } from "./WhereAmAPI";
const fs = require("filesystem");
const clipboard = require("clipboard");

let chronosScorer = new TextModule(
    "chronosscorer",
    "GXU: Chronos Scoring Helper",
    "Keeps track of points in games of Chronos. (All parameters are stored in weights.json)",
    KeyCode.None
);
let optionUseInPubs = chronosScorer.addBoolSetting(
    "pubs",
    "Use in Public Games",
    "Whether to keep track of scores in public games.",
    false
);
let optionReloadKey = chronosScorer.addKeySetting(
    "reloadkey",
    "Reload Key",
    "Pressing this key will reload the current score weights.\n(This will NOT retroactively alter points in the middle of a game!)",
    KeyCode.U
)
client.getModuleManager().registerModule(chronosScorer);

const weightsLocation: string = "weights.json";

/*
Key points:
- This can only work in Chronos Solos private games, unless "Use in Public Games" is enabled. Check for that on game start.
- Game starts on the title with type title and content "Go!"
- In messages with 1 player name, that player name has always died.
- In messages with 2 player names, the FIRST player was the killer, and the SECOND player was the one killed.
  - The Corruption is the exception.
- Elimination is indicated by either:
  - The character \uE136 appearing in the message
  - The player not appearing in any future messages (assume elimination via disconnect immediately after)
*/

// Initialize the scores file if it doesn't exist
let weights: Scores;
if(!fs.exists(weightsLocation)) {
    resetWeightFile();
}

loadWeightFile();

// Main hooks
let active: boolean = false;
let lastTimeLeaderTitle: string; // Used for `timeLeaderAtTimeFreeze`

client.on("title", e => {
    if(notOnGalaxite()) return;
    if(api.serverName != "ChronosSolo") return;

    // Store time leader title to avoid using 2 title events. This will make sense later.
    if(
        active &&
        e.type == "actionbar"
        && e.text.includes("Time Leader: \xA74")
    ) {
        lastTimeLeaderTitle = e.text;
    }

    // Check for correct title contents
    if(!(e.type == "title" && e.text == "Go!")) return;

    // Check for valid use
    if(optionUseInPubs.getValue()) {
        gameStart();
    }
    else {
        if(api.privacy == "Private") {
            gameStart()
        }
    }
});
api.on("whereami-update", () => {
    if(active) {
        sendGXUMessage("Scores are no longer being tracked!");
        endGame();
    }
    active = false;
});

// Game start
let playersAtGameStart: string[];
let winner: string = "";
let playerRegex: RegExp;
let playerDatabase: {[index: string]: EventPlayer};
/**
 * Used for determing when into a game something happened. Higher means later on.
 */
let messageIndex: number = 0;
function gameStart() {
    sendGXUMessage("Scores are being tracked! DO NOT change your nickname!")
    active = true;
    messageIndex = 1;

    // Initialize player names
    playersAtGameStart = world.getPlayers();
    let rgxCreationString = getNickname(); // More is added later on

    playersAtGameStart.forEach((playerName) => {
        playerDatabase[playerName] = {
            score: weights.basePoints,
            eliminatedIndex: 0,
            lastAppearanceIndex: 0,
            probableSpectator: false
        };

        rgxCreationString += `|${playerName}`; // read as "OR [player name]"

    });
    /*
    playerDatabase looks like:
    {
        "playerName": {EventPlayer},
        "playerName2": {EventPlayer2},
        ...
    }
    */
   playerRegex = new RegExp(rgxCreationString, "gm");
}

// E0AD is a special arrow symbol used before every death message
const deathMessageCheck = /\uE0AD/;
const timeFreezeCheck = /\uE0BD \xA7aTime slows down and begins to freeze! Kills no longer give time!/
const gameEndCheck = /\uE0BD [.*] Is The Chronos Champion!/;
const formatReplacer = /\xA7.|\[\+\d+\]/g; // Replaces both Minecraft formatting and the Chronos time on kill indicator

// Interpret game messages
client.on("receive-chat", m => {
    if(notOnGalaxite()) return;

    // Store the message without any of the bloat
    const message = m.message.replace(formatReplacer, "").trim();

    // 1. Verify that a message is a system message
    // note: Check against systemMessageCheck and timeFreezeCheck - everything else is probably a player message
    // note: \uE0AD for main messages, or \uE0BD for time freeze
    const deathMessage = deathMessageCheck.test(message);
    const timeFreeze = timeFreezeCheck.test(message);
    const gameEnd = gameEndCheck.test(message);
    if(!(deathMessage || timeFreeze || gameEnd)) return;

    // Since this message is being considered, add to the message index
    messageIndex += 1;

    // 2. Interpret the contents of the message
    // note: look for the bounty kill (\uE148), bounty shutdown (\uE14A), and elimination (\uE136) symbols
    // note: Consider the matches of playerRegex

    // Time freeze case
    if(timeFreeze) {
        const timeFreezeMatch = playerRegex.exec(lastTimeLeaderTitle); // Get the player from the time leader title
        if(!timeFreezeMatch) return; // If there somehow is no match, stop processing
        const timeLeader = timeFreezeMatch[0];
        playerDatabase[timeLeader].score += weights.timeLeaderAtTimeFreeze; // The player who is in the title

        return;
    }

    // Game end case
    if(gameEnd) {
        const matches = gameEndCheck.exec(message);
        if(!matches) return;

        winner = matches[0];
    }

    // Death message case
    if(deathMessage) {
        const matches = playerRegex.exec(message); // Get the players who appear in the message
        if(!matches) return;

        // Various properties
        const elimination: boolean = message.includes("\uE136"),
            bountyKill: boolean = message.includes("\uE148"),
            bountyShutdown: boolean = message.includes("\uE14A");

        if(matches.length == 1) { // One player - always a death or elimination message
            const deadPlayer = matches[0];
            playerDatabase[deadPlayer].lastAppearanceIndex = messageIndex;

            playerDatabase[deadPlayer].score += weights.death;
            if(elimination) {
                playerDatabase[deadPlayer].eliminatedIndex = messageIndex;
            }
        }
        else if(matches.length == 2) { // 2 players - matches[0] kills matches[1]
            const killer = matches[0];
            playerDatabase[killer].lastAppearanceIndex = messageIndex;
            const deadPlayer = matches[1];
            playerDatabase[deadPlayer].lastAppearanceIndex = messageIndex;

            playerDatabase[killer].score += weights.kill;
            playerDatabase[deadPlayer].score += weights.death;
            if(bountyKill) {
                playerDatabase[killer].score += weights.bountyCompletionKill;
                playerDatabase[deadPlayer].score += weights.bountyCompletionDeath;
            }
            if(bountyShutdown) {
                playerDatabase[killer].score += weights.bountyShutdownKill;
                playerDatabase[deadPlayer].score += weights.bountyShutdownDeath;
            }
            if(elimination) {
                playerDatabase[killer].score += weights.eliminationBonus;
                playerDatabase[deadPlayer].eliminatedIndex = messageIndex;
            }
        }
        else {
            sendGXUMessage("Error in Chronos Scorer: Invalid amount of players in event message");
        }
    }
});

// Game end
function endGame(): void {
    // Re-assign eliminations
    const databaseKVPsForElims = getEntries(playerDatabase); // 2d array. Given [n][m]: [n] is an index; [m = 0] is the player name, [m = 1] is their information
    let playerDatabaseNoSpectators: {[index: string]: EventPlayer}; // I don't know how to delete an entry so I'm rebuilding it from the start

    // Verify elimination timing
    databaseKVPsForElims.forEach(([playerName, playerData]) => {
        if(playerData.eliminatedIndex == 0 && playerData.lastAppearanceIndex == 0) { // Both not set - probably spectator
            playerDatabase[playerName].probableSpectator = true;
        }
        if(playerData.eliminatedIndex == 0 && playerData.lastAppearanceIndex != 0) { // Only last appearance set - presumably disconnected after last appearance
            if(playerName == winner) {
                playerDatabase[playerName].eliminatedIndex = Number.MAX_SAFE_INTEGER; // funny
            }
            else {
                playerDatabase[playerName].eliminatedIndex = playerData.lastAppearanceIndex;
            }
            playerDatabaseNoSpectators[playerName] = playerDatabase[playerName];
        }
    });

    // Handle placement
    let placementOrder: string[] = [];

    // Send a message with the current scores
    sendGXUMessage("This game's standings:\n" + getCurrentScores());
}

function getCurrentScores(): string {
    let formattedScores: string = "";
    return(formattedScores);
}

// Render
chronosScorer.on("text", (p, e) => {
    if(notOnGalaxite()) return "";
    if(!chronosScorer.isEnabled()) return "";
    if(!active) return "";

    return(getCurrentScores())
});

// Utility
const getEntries = Object.entries;

function loadWeightFile() {
    // Read the weight file
    try {
        weights = JSON.parse(util.bufferToString(fs.read(weightsLocation))) as Scores;
    }
    catch (error) {
        weights = defaultWeights;
        resetWeightFile();
        sendGXUMessage("Error in Chronos Scorer: Attempted to parse invalid weight config (the file has additionally been reset). Don't add more properties!");
    }
}

function resetWeightFile() {
    fs.write(weightsLocation, util.stringToBuffer(JSON.stringify(defaultWeights, null, 2)));
}