// Chat Debloat: Hides a bunch of spammy chat messages and outputs invisible status to a HUD module
// (totally not stolen from an onix script of about the same name)

// https://github.com/OnixClient-Scripts/OnixClient_Scripts/blob/bee9a02abc5469c3bb5aea4402ab4b0813c40fa7/Modules/gxt.lua

/* NOTES:
- Join: \u00ba\u0020
- Info (ex. invisible): \u00bc\u0020
  Note: only apply this to invisible messages, Info has some useful stuff + invisible is the module anyway
- Notice (ex. hub messages): \u00b9\u0020
- Warn: (intentionally omitted)
- Melvin: \u00ad\u0020\u00a7\u006c\u00a7\u0036Miner
*/

import { notOnGalaxite } from "./exports";

// initialize
let chatDebloat = new Module(
    "chatDebloat",
    "Chat Debloat",
    "Hides some spammy chat messages, with the added capability to move invisibility to its own module",
    KeyCode.None,
);
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
client.getModuleManager().registerModule(chatDebloat);

// hook
client.on("receive-chat", msg => {
    if(notOnGalaxite() || !chatDebloat.isEnabled()) return;

    // cache message for ease of reference
    let message = msg.message;
    if(message.startsWith("\u00ba\u0020") && optionHideJoins.getValue()) { // join
        msg.cancel = true;
    }
    if(message.startsWith("\u00b9\u0020") && optionHideNotices.getValue()) { // notices
        msg.cancel = true;
    }
    if(message.startsWith("\u00ad\u0020\u00a7\u006c\u00a7\u0036Miner") && optionHideMelvin.getValue()) { // melvin
        msg.cancel = true;
    }
});