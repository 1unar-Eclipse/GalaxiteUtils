// Compact Badges: Replaces the default chat badges (Player, Helper, etc.) with their unused short counterparts.
// Note 1: Short badges are 0x0010 behind their corresponding long badges
// Note 2: Elite + Ultra has no short version; which should it be replaced by? (solution is an option lol why not)

import { notOnGalaxite } from "./exports";

let compactBadges = new Module(
    "compactbadges",
    "Compact Badges",
    "Adds options to trim or remove the chat badges",
    KeyCode.None
);
let optionRemoveBadges = compactBadges.addBoolSetting(
    "removebadges",
    "Remove Player Badges",
    "Completely hides all non-staff badges (Player, Elite, etc.).\n\nIf this is disabled, all badges will be compacted instead.",
    // Hides Player, Ultra, Elite, Elite + Ultra, VIP, and Influencer
    false
);
let optionHidePrestigeIcons = compactBadges.addBoolSetting(
    "hideprestige",
    "Hide Prestige Badges",
    "Hides all battlepass prestige badges.",
    false
)
let optionComboToggle = compactBadges.addBoolSetting(
    "combotoggle",
    "Combination Badge Acts as Elite",
    "If this setting is enabled, players with the combination Elite & Ultra badge appear as Elite. If disabled, Ultra.",
    true
);
client.getModuleManager().registerModule(compactBadges);

// respectively: elite & ultra, elite, player, vip, ultra, influencer
let rgxPlayerBadges = /\uE096|\uE099|\uE09A|\uE09D|\uE09E|\uE09F/;

// elite, player, staff, helper, vip, ultra, influencer. combo badge excluded for its own test
let rgxBadges = /\uE099|\uE09A|\uE09B|\uE09C|\uE09D|\uE09E|\uE09F/;

// p1-p5 respectively
let rgxPrestiges = /\uE1D9|\uE1DA|\uE1DB|\uE1DC|\uE1DD/;

client.on("receive-chat", c => {
    if(notOnGalaxite() || !compactBadges.isEnabled()) return;

    let editedMessage = c.message; // cache a message to edit and resend later

    if(optionHidePrestigeIcons.getValue()) { // if the user wants to hide prestige icons:
        if(rgxPrestiges.test(editedMessage)) { // check if message has a prestige icon
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxPlayerBadges, ""); // delete the prestige icon
        }
    }

    if(optionRemoveBadges.getValue()) { // if the user wants to delete player badges:
        if(rgxPlayerBadges.test(editedMessage)) { // check if message has a player badge
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxPlayerBadges, ""); // delete the player badge
        }
    }
    else { // if user wants to just shorten badges:
        if(editedMessage.includes("\uE096")) { // check for elite & ultra
            c.cancel = true;
            editedMessage = editedMessage.replace(
                "\uE096", optionComboToggle.getValue() ? "\uE089" : "\uE08E" // replace combo badge with short elite if option is on, short ultra if off
            )
        }
        if(rgxBadges.test(editedMessage)) { // check for any badge except elite & ultra
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxBadges, (substring) => { // get the matching badge
                // take the badge, turn it into a number, subtract 0x10 from that number to make it a short badge, then turn it back into a string
                return String.fromCharCode(substring.charCodeAt(0) - 0x10);
            });
        }
    }

    if(c.cancel)
        clientMessage(editedMessage.trim()); // if the message was changed, cancel the source message and resend the edited one
});