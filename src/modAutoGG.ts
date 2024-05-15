// AutoGG: Automatically sends "gg" on game end

/* TO-DO:
- Significant overhauls (I'll need to redo this whole thing tbh)
*/

import { notOnGalaxite, nerdRadar, gxuSplashes } from "./exports";
const fs = require("filesystem");

// Module setup
let autoGG = new Module(
    "autoGG",
    "GXU: AutoGG",
    'Automatically says "gg" when a game finishes.',
    KeyCode.None
);
client.getModuleManager().registerModule(autoGG);

let ch = autoGG.addBoolSetting(
    "ch",
    "Chronos",
    "Chronos support",
    true
);
let ru = autoGG.addBoolSetting(
    "ru",
    "Rush",
    "Rush support",
    true
);
let hr = autoGG.addBoolSetting(
    "hr",
    "Hyper Racers",
    "Hyper Racers support",
    true
);
let cw = autoGG.addBoolSetting(
    "cw",
    "Core Wars",
    "Core Wars support",
    true
);
let ftg = autoGG.addBoolSetting(
    "ftg",
    "Fill the Gaps",
    "Fill the Gaps support",
    true
);
let ph = autoGG.addBoolSetting(
    "ph",
    "Prop Hunt",
    "Prop Hunt support",
    true
);
let nerdToggle: Setting;
let nerdToggleExists = false;
if(fs.exists("NerdToggle")) {
    nerdToggleExists = true;
    nerdToggle = autoGG.addBoolSetting(
        "nerdtoggle",
        "Nerd Toggle",
        'Says the full "Good game!" when saying GG',
        true
    );
}

/* Galaxite Game End Messages:
hr            - "Finished!", "Out of Time!"
ftg           - "\xA7l<team> Team\xA7r\xA7a won the game!"
ch (subtitle) - "Is The \xA76\xA7lChronos Champion!", "Are The \xA76\xA7lChronos Champions!"
ru (subtitle) - "Is The \xA76\xA7lRush Champion!", "Are The \xA76\xA7lRush Champions!"
cw            - "\xA7l<team> Team\xA7r\xA7a won the game!"
ph            - "\xA7bHiders\xA7r\xA7f Win", "\xA7eSeekers\xA7r\xA7f Win"
No other modes have gg rewards */

// cache regex
const rgxFtgCw = /Team\xA7r\xA7a won the game!/; // does it work like this?
const rgxChRu = /(Is|Are) The \xA76\xA7l(Chronos|Rush) Champion(|s)!/;
const rgxPh = /\xA7(bHiders|eSeekers)\xA7r\xA7f Win/;

function sendGG() {
    clientMessage("GG should've been sent.");
    if(nerdRadar() && (nerdToggle.getValue() == null || nerdToggle.getValue())) { // if the sender is wiki team, and either the nerd toggle setting does not exist or is on
        game.sendChatMessage("Good game!");

        if(!fs.exists("NerdToggle")) { // if the nerdtoggle file does not exist
            fs.write("NerdToggle", util.stringToBuffer(gxuSplashes[Math.floor(Math.random() * gxuSplashes.length)])); // force it to exist and write anything on it really
        }
    }
    else {
        game.sendChatMessage("gg");
    }
}

let sendWhereAmI: boolean = false,
    awaitWhereAmI: boolean = false;

// All games have a title
client.on("title", title => {
    if(notOnGalaxite()) return;
    if(!autoGG.isEnabled()) return;

    let text = title.text; // cache title

    // gg conditions
    if(hr.getValue()) {
        if(text == "Finished" || text == "Out of Time!")
            sendGG();
    }
    if(ftg.getValue() || cw.getValue()) {
        if(rgxFtgCw.test(text))
            sendGG();
    }
    if(ch.getValue() || ru.getValue()) {
        if(rgxChRu.test(text))
            sendGG();
    }

    // prop hunt
    if(ph.getValue()) {
        if(rgxPh.test(text)) {
            sendWhereAmI = true;
        }
    }
});

let changeDimensionBandage = true; // exact same bandage fix as whereamihud

// prop hunt requires entering the postgame first
client.on("change-dimension", e => {
    if(sendWhereAmI) {
        if(changeDimensionBandage) {
            changeDimensionBandage = false;
            sendWhereAmI = false;
            game.executeCommand("/whereami");
            awaitWhereAmI = true;
        }
        else {
            changeDimensionBandage = true;
        }
    }
});

// take in a whereami to confirm 
client.on("receive-chat", msg => {
    if(awaitWhereAmI) {
        if(msg.message.includes("ServerUUID: ") && msg.message.includes("\n")) { // if message actually is a whereami response
            msg.cancel = true;
            awaitWhereAmI = false;
            if(msg.message.includes("PropHunt"))
                sendGG(); // gg
        }
    }
});