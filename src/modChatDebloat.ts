// Chat Debloat: Hides a bunch of spammy chat messages and outputs invisible status to a HUD module
// (totally not stolen from an onix script of about the same name)

// https://github.com/OnixClient-Scripts/OnixClient_Scripts/blob/bee9a02abc5469c3bb5aea4402ab4b0813c40fa7/Modules/gxt.lua

/* NOTES:
- Join: \xba\x20
- Info (ex. invisible): \xbc\x20
  Note: only apply this to invisible messages, Info has some useful stuff + invisible is the module anyway
- Notice (ex. hub messages): \xb9\x20
- Warn: (intentionally omitted)
- Melvin: \xad\x20\xa7\x6c\xa7\x36Miner
*/

import { notOnGalaxite } from "./exports";

// initialize
let chatDebloat = new HudModule(
    "chatDebloat",
    "Chat Debloat",
    "Hides some spammy chat messages, with the added capability to move invisibility to its own module",
    KeyCode.None,
    true
);
client.getModuleManager().registerModule(chatDebloat);

// settings
let optionHideJoins = chatDebloat.addBoolSetting(
    "hideJoin",
    "Hide Joins",
    "Hide player join messages",
    false
);
let optionHideNotices = chatDebloat.addBoolSetting(
    "hideNotices",
    "Hide Notices",
    "Hides notice messages (ex. hub messages)",
    true
);
let optionHideMelvin = chatDebloat.addBoolSetting(
    "hideMelvin",
    "Hide Melvin Messages",
    "Hides chat messages relating to Melvin's Mine",
    false
);
let optionHideInvisible = chatDebloat.addBoolSetting(
    "hideInvisible",
    "Hide Invisible Messages",
    "Hides messages indicating your invisiblity state",
    true
);
let optionInvisibleModule = chatDebloat.addBoolSetting(
    "useInvisibleModule",
    "Use Invisible Module",
    "Shows invisiblity status in a module",
    false
);
optionInvisibleModule.setCondition("hideInvisible", true);

// store invisible bool
let invisible: boolean = false;

// hook
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    // cache message for ease of reference
    let message = msg.message;
    if(message.startsWith("\xba\x20") && optionHideJoins.getValue()) { // join
        msg.cancel = true;
    }
    if(message.startsWith("\xb9\x20") && optionHideNotices.getValue()) { // notices
        msg.cancel = true;
    }
    if(message.startsWith("\xad\x20\xa7\x6c\xa7\x36Miner") && optionHideMelvin.getValue()) { // melvin
        msg.cancel = true;
    }
    if(message.startsWith("\xba\x20You are now") && optionHideInvisible.getValue()) { // invisible
        invisible = message.includes("invisible"); // sync the plugin's invisibility status to whether the message contains it
        msg.cancel = true;
    }
});

// render text
chatDebloat.on("text", () => {
    if(notOnGalaxite() || optionInvisibleModule.getValue() == false)
        return "";

    switch(invisible) {
        case true:
            return "Invisible";
        default:
        case false:
            return "";
    }
});