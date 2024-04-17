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
    "Completely hides all non-staff badges (Player, Elite, etc.)", // Hides Player, Ultra, Elite, Elite + Ultra, VIP, and Influencer
    false
);
let optionComboToggle = compactBadges.addBoolSetting(
    "combotoggle",
    "Combination Badge Acts as Elite",
    "Controls the behavior for the normal Elite + Ultra combination badge.\n\nIf this setting is enabled, players with the combination badge appear as Elite. If disabled, Ultra.",
    true
);
optionComboToggle.setCondition("removebadges", false);