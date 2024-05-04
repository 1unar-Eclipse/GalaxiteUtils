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
let optionComboToggle = compactBadges.addBoolSetting(
    "combotoggle",
    "Combination Badge Acts as Elite",
    "If this setting is enabled, players with the combination Elite & Ultra badge appear as Elite. If disabled, Ultra.",
    true
);
client.getModuleManager().registerModule(compactBadges);

let playerBadges = [
    0xE096, // elite + ultra
    0xE099, // elite
    0xE09A, // player
    0xE09D, // vip
    0xE09E, // ultra
    0xE09F  // influencer
];

client.on("receive-chat", c => {
    if(notOnGalaxite() || !compactBadges.isEnabled()) return;

    let badge = c.message.charCodeAt(0); // badge
    let editedMessage = c.message;
    if(optionRemoveBadges.getValue()) {
        if(playerBadges.includes(badge)) {
            c.cancel = true;
            editedMessage = editedMessage.replace(c.message[0], ""); // badge is always the first character
        }
    }
    else {
        if(0xE099 <= badge && badge <= 0xE09F) { // any badge except elite + ultra
            c.cancel = true;
            editedMessage = editedMessage.replace( // make the edited message replace the badge (likely first character) with the short badge 0x10 characters behind
                c.message[0], String.fromCharCode(badge - 0x10)
            );
        }
        if(badge == 0xE096) { // elite + ultra
            c.cancel = true;
            editedMessage = editedMessage.replace(
                c.message[0], String.fromCharCode( // the badge thankfully only appears once
                    optionComboToggle.getValue() ? 0xE099 : 0xE09E // elite if option is on, ultra if off
                )
            )
        }
    }

    if(c.cancel)
        clientMessage(editedMessage);
});