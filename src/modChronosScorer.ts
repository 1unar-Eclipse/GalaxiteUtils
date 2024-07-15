// Chronos Scorer: Helper for scoring Chronos Solos events.

import { notOnGalaxite, Scores, defaultWeights } from "./exports";
import { api } from "./WhereAmAPI";
const fs = require("filesystem")

let chronosScorer = new TextModule(
    "chronosscorer",
    "GXU: Chronos Scoring Helper",
    "Keeps track of points in games of Chronos. (All parameters are kept track of in weights.json)",
    KeyCode.None
);
let optionUseInPubs = chronosScorer.addBoolSetting(
    "pubs",
    "Use in Public Games",
    "Whether to keep track of scores in public games.",
    false
);
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

// Initialize the scores file
let weights: Scores
if(!fs.exists(weightsLocation)) {
    weights = defaultWeights;
    fs.write(weightsLocation, util.stringToBuffer(JSON.stringify(weights)));
}
weights = JSON.parse(util.bufferToString(fs.read(weightsLocation))) as Scores;