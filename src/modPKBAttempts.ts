// Parkour Builders Attempts: Shows current attempts on a Parkour Builders run.

import { notOnGalaxite, sendGXUMessage } from "./exports";
import { api, GameName } from "./WhereAmAPI";
const fs = require("filesystem");

// initialize
let pkbAttempts = new TextModule(
    "pkbattempts",
    "GXU: PKB Attempts",
    "Shows attempts in a Parkour Builders run.",
    KeyCode.None
);
let currentRun = pkbAttempts.addBoolSetting(
    "currentrun",
    "Show Current Attempts",
    "Shows the current attempts taken.",
    true
);
let currentRunPrefix = pkbAttempts.addTextSetting(
    "currentprefix",
    "Prefix (Current Attempts)",
    "Text to display before the current run's attempts.",
    "Attempts: "
);
let currentRunSuffix = pkbAttempts.addTextSetting(
    "currentsuffix",
    "Prefix (Current Attempts)",
    "Text to display after the current run's attempts.",
    ""
);
currentRunPrefix.setCondition("currentrun");
currentRunSuffix.setCondition("currentrun");
let lifetime = pkbAttempts.addBoolSetting(
    "lifetime",
    "Show Lifetime Attempts",
    "Shows all attempts you have taken on the parkour.\nThis information is always tracked, regardless of this setting or if the module is enabled. It is NOT retroactive.",
    true
);
let lifetimePrefix = pkbAttempts.addTextSetting(
    "lifetimeprefix",
    "Prefix (Lifetime Attempts)",
    "Text to display before your total attempts.",
    "Lifetime Attempts: "
);
let lifetimeSuffix = pkbAttempts.addTextSetting(
    "lifetimesuffix",
    "Suffix (Lifetime Attempts)",
    "Text to display after your total attempts.",
    ""
);
lifetimePrefix.setCondition("lifetime");
lifetimeSuffix.setCondition("lifetime");

client.getModuleManager().registerModule(pkbAttempts);

let currentAttempts: number;
let attemptDatabase: any;
let attemptDirectory = "ParkourAttempts.json";

if(!fs.exists(attemptDirectory)) {
    fs.write(attemptDirectory, util.stringToBuffer(JSON.stringify({} as any, null, 4)));
}
attemptDatabase = JSON.parse(util.bufferToString(fs.read(attemptDirectory)));

/* Notes on what to do:
- The player MUST be in a server with a ParkourUUID for attempts to be displayed. I'm electing to keep the same attempt amount even if the player "restarts" the parkour, unlike Geometry Dash.
  - Can be done with `if(!api.parkourUUID) return;`
- An attempt looks like `\uE0AD {playerName} \uE137`
- Update the JSON file on every attempt. This may kill the drive, but it is more accurate in case the user rage-quits.
  - Also, I'm pretty sure this stuff is put into RAM first for a bit anyway.

JSON structure:
{
    parkourID1 (string) : attempts1 (number),
    parkourID2 : attempts2
    ...
    parkourID : attempts
}
*/

api.on("whereami-update", () => {
    currentAttempts = 0;
});

// Track attempts
client.on("title", t => {
    if(notOnGalaxite()) return;
    if(!api.parkourUUID) return;

    if(t.text == "\xA7a\xA7lGO") {
        currentAttempts += 1;
        incrementGlobalAttempts(1);
    }
});

client.on("receive-chat", m => {
    if(notOnGalaxite()) return;
    if(!api.parkourUUID) return;

    const rgxDeathMessage = new RegExp(
        `\uE0AD (${
            game.getLocalPlayer()?.getName()
        }|${
            client.getModuleManager().getModuleByName("Nickname")?.getSettings()[2].getValue()
        }) \uE137`
    );
    if(rgxDeathMessage.test(m.message)) {
        currentAttempts += 1;
        incrementGlobalAttempts(1);
    }
});

// TO-DO: Correct attempts for to-be-published parkours (currently off by 1)

/**
 * Adds 1 to the lifetime attempts of the current Parkour UUID, and initializes it if it does not exist.
 */
function incrementGlobalAttempts(by: number) {
    if(api.parkourUUID) {
        if(!attemptDatabase[api.parkourUUID]) // if there is no value for the current id:
            attemptDatabase[api.parkourUUID] = 0; // initialize it to 0
        attemptDatabase[api.parkourUUID] += by; // the combination of setting to zero then adding 1 ultimately makes the default 1
        fs.write(attemptDirectory, util.stringToBuffer(JSON.stringify(attemptDatabase, null, 4)));
    }
    else {
        sendGXUMessage("Error in PKB Attempts: Attempted to change attempts of null parkour");
    }
}

// The rendering half
pkbAttempts.on("text", (p, e) => {
    if(p || e)
        return appendDetails(10, 73);

    if(notOnGalaxite()) return "";
    if(!pkbAttempts.isEnabled()) return "";
    if(!api.parkourUUID) return "";

    return appendDetails(currentAttempts, attemptDatabase[api.parkourUUID] ?? 0);
});

function appendDetails(currentAttemptsLoc: number | string, lifetimeAttemptsLoc: number | string): string {
    let str = "";
    let currentVal = currentRun.getValue() as boolean;
    let lifetimeVal = lifetime.getValue() as boolean;

    // this may look weird, but it fixes the whereamihud trim bug. this is just smaller-scale, so it's more feasible.
    if(currentVal) {
        str += (currentRunPrefix.getValue() + currentAttemptsLoc + currentRunSuffix.getValue());
    }
    if(currentVal && lifetimeVal) {
        str += "\n";
    }
    if(lifetimeVal) {
        str += (lifetimePrefix.getValue() + lifetimeAttemptsLoc + lifetimeSuffix.getValue());
    }
    return str;
}