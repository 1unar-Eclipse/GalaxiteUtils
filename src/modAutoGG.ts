// AutoGG: Automatically sends "gg" on game end

import notOnGalaxite from "index";

// Module setup
let mod = new Module(
    "AutoGG",
    "Galaxite AutoGG",
    'Automatically says "gg" when a game finishes. (not supported for CW, FTG, and PH right now)',
    KeyCode.None
);
client.getModuleManager().registerModule(mod);

let chru = mod.addBoolSetting(
    "chru",
    "Chronos/Rush",
    "Chronos and Rush support"
);
let hr = mod.addBoolSetting(
    "hr",
    "Hyper Racers",
    "Hyper Racers support"
);

/* Galaxite Game End Messages:
- Prop Hunt: None, titles AND world join needed (this mode's weird)
- Core Wars: None, titles needed
- Fill the Gaps: None, titles needed
- Chronos: "(is/Team are) the Chronos Champion(s)!"
- Hyper Racers: "Race Finished!"
- Rush: "(is/Team are) the Rush Champion(s)"!
No other modes have gg rewards */

// cache regex
let rgxChrRush = /(is|(t|T)eam are) (t|T)he (Chronos|Rush) Champion(|s)!/;

// Chronos, Rush, and Hyper Racers
client.on("receive-chat", msg => {
    // account for the escape case
    if(notOnGalaxite()) return;

    // cache message
    let message = msg.message;

    // Chronos and Rush
    if(chru.getValue() && rgxChrRush.test(message)) {
        game.sendChatMessage("gg");
    }

    // Hyper Racers
    if(hr.getValue() && message.includes("Race Finished!")) {
        game.sendChatMessage("gg");
    }

    // Core Wars/Fill the Gaps
    // no titles

    // Prop Hunt:
    // ?????
});