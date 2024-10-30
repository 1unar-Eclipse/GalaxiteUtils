// AutoGG: Automatically sends "gg" on game end

/* TO-DO:
- Significant overhauls (I'll need to redo this whole thing tbh)
*/

import { notOnGalaxite, nerdRadar, gxuSplashes, sendGXUMessage } from "./exports";
import { api, GameName } from "./WhereAmAPI";
const fs = require("filesystem");

// Module setup
let autoGG = new Module(
    "autoGG",
    "GXU: AutoGG",
    'Automatically say "gg" when a game finishes.',
    KeyCode.None
);
client.getModuleManager().registerModule(autoGG);

let ch = autoGG.addBoolSetting(
    "ch",
    "Chronos",
    'Whether to say "gg" in games of Chronos.',
    true
);
let ru = autoGG.addBoolSetting(
    "ru",
    "Rush",
    'Whether to say "gg" in games of Rush.',
    true
);
let hr = autoGG.addBoolSetting(
    "hr",
    "Hyper Racers",
    'Whether to say "gg" in games of Hyper Racers.',
    true
);
let cw = autoGG.addBoolSetting(
    "cw",
    "Core Wars",
    'Whether to say "gg" in games of Core Wars.',
    true
);
let ftg = autoGG.addBoolSetting(
    "ftg",
    "Fill the Gaps",
    'Whether to say "gg" in games of Fill the Gaps.',
    true
);
let ph = autoGG.addBoolSetting(
    "ph",
    "Prop Hunt",
    'Whether to say "gg" in games of Prop Hunt.',
    true
);

let nerdToggle: Setting;
if(fs.exists("NerdToggle")) {
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

/**
 * Sends "gg" if:
 * * The player is not on Wiki Team OR
 * * The player is on Wiki Team, but has the secret "Nerd Toggle" option disabled
 * Sends "Good game!" if:
 * * The player is on Wiki Team AND EITHER
 *   * The player has the secret "Nerd Toggle" option disabled OR
 *   * The player cannot see the secret "Nerd Toggle" option
 */
function sendGG() {
    sendMessage(hasNerdToggleEnabled() ? "Good game!" : "gg");
}

function hasNerdToggleEnabled(): boolean {
    if(nerdRadar()) { // If on wiki team in the first place
        if(!fs.exists("NerdToggle") || !nerdToggle) { // Secret option not discovered -> always acts as true
            fs.write("NerdToggle", util.stringToBuffer(String.fromCharCode(0x1F913))); // Make the file for future use
            return true;
        }
        else { // Secret option discovered and visible -> always acts as setting value
            return nerdToggle.getValue();
        }
    }
    else { // Not on wiki team -> always false
        return false;
    }
}

let firstError: boolean = true;
function sendMessage(message: string) {
    try {
        game.sendChatMessage(message);
    } catch (error) {
        if(firstError) {
            sendGXUMessage("Error in AutoGG: there is currently no permission to send messages");
            firstError = false;
        }
    }
}

// All games have a title
client.on("title", title => {
    if(notOnGalaxite()) return;
    if(!autoGG.isEnabled()) return;

    let text = title.text; // cache title

    // gg conditions
    if(
        hr.getValue() && api.game == GameName.HYPER_RACERS
    ) {
        if(text == "Finished" || text == "Out of Time!")
            sendGG();
    }

    if(
        (ftg.getValue() && api.game == GameName.FILL_THE_GAPS) ||
        (cw.getValue() && api.game == GameName.CORE_WARS)
    ) {
        if(rgxFtgCw.test(text))
            sendGG();
    }
    
    if(
        (ch.getValue() && api.game == GameName.CHRONOS) ||
        (ru.getValue() && api.game == GameName.RUSH)
    ) {
        if(rgxChRu.test(text))
            sendGG();
    }

    // prop hunt
    if(ph.getValue()) {
        if(rgxPh.test(text)) {
            api.once("whereami-update", () => {
                if(api.game == GameName.PROP_HUNT)
                    sendGG();
            });
        }
    }
});