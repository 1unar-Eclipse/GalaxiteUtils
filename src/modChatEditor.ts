// Chat Editor: Allows for various changes to the in-game chat.
// CompactBadges file name kept for legacy compatibility.

import { getNickname, notOnGalaxite, sendGXUMessage } from "./exports";

let chatEditor = new Module(
    "compactBadges",
    "GXU: Chat Editor",
    "Adds options to modify various parts of the Galaxite chat.\nThis module is incompatible with anything else that edits chat (such as the Timestamps plugin).",
    KeyCode.None
);
let optionCompactBadges = chatEditor.addBoolSetting( // Shortens badges.
    "compactbadges",
    "Compact Badges",
    "Shortens all badges.",
    false
);
let optionComboToggle = chatEditor.addBoolSetting( // Controls combination badge behavior.
    "combotoggle",
    "Combination Badge Acts as ELITE",
    "If this setting is enabled, players with the combination ELITE & ULTRA badge appear as ELITE. If disabled, ULTRA.",
    true
);
optionComboToggle.setCondition("compactbadges", true); // this toggle makes sense only if you're shortening badges
let optionClassicBadges = chatEditor.addBoolSetting(
    "classicbadges",
    "Classic Badges",
    "Uses Minecraft text for player badges instead of custom graphics.",
    false
);
optionClassicBadges.setCondition("compactbadges", false);
optionCompactBadges.setCondition("classicbadges", false);
let optionClassicServerBadges = chatEditor.addBoolSetting(
    "classicserverbadges",
    "Classic Server Badges",
    "Uses Minecraft text for server badges (Warn, Info, etc.) instead of custom graphics.",
    false
);
let optionRemoveBadges = chatEditor.addBoolSetting( // Removes badges. Not mutually exclusive with Compact or Classic Badges because they would still work on staff badges
    "removebadges",
    "Remove Player Badges",
    "Completely hides all non-staff player badges (Player, ELITE, etc.).",
    // Hides Player, ULTRA, ELITE, ELITE + ULTRA, VIP, and Influencer
    false
);
let optionHidePrestigeIcons = chatEditor.addBoolSetting(
    "hideprestige",
    "Hide Prestige Badges",
    "Hides all battlepass prestige badges.",
    false
);
let optionClassicPrestigeIcons = chatEditor.addBoolSetting(
    "classicprestige",
    "Classic Prestige Icons",
    "Uses Minecraft text for Prestige icons instead of custom graphics.",
    false
);
optionClassicPrestigeIcons.setCondition("hideprestige", false);
optionHidePrestigeIcons.setCondition("classicprestige", false);
let optionOverrideNameColor = chatEditor.addColorSetting(
    "overridenamecolor",
    "Name Color Override",
    "Changes your name color on your screen. The closest Minecraft color to the input color will be used in chat.\n" +
        "This setting is assumed to be disabled at less than 80% opacity.\n" +
        "Check https://minecraft.wiki/w/Formatting_codes#Color_codes for a list of colors!",
    new Color(0, 0, 0, 0)
);
client.getModuleManager().registerModule(chatEditor);

// respectively: elite & ultra, elite, player, vip, ultra, influencer
const rgxPlayerBadges = /(\uE396|\uE399|\uE39A|\uE39D|\uE39E|\uE39F) /;
// combo, elite, player, staff, helper, vip, ultra, influencer
const rgxBadges = /(\uE396|\uE399|\uE39A|\uE39B|\uE39C|\uE39D|\uE39E|\uE39F) /;
// all badges (for classic badges)
const rgxAllBadges = /(\uE396|\uE399|\uE39A|\uE39B|\uE39C|\uE39D|\uE39E|\uE39F) /;
// p1-p5 respectively
const rgxPrestiges = /(\uE4D9|\uE4DA|\uE4DB|\uE4DC|\uE4DD)/;
// notice, join, warn, info, game, team, party
const rgxServerBadges = /(\uE3B9|\uE3BA|\uE3BB|\uE3BC|\uE3BD|\uE3BE|\uE3BF) /;
// map that converts long badges to short badges
const shortbadgeMap = new Map([
    ["\uE399 ", "\uE389 "], // elite
    ["\uE39A ", "\uE38A "], // player
    ["\uE39B ", "\uE38B "], // staff
    ["\uE39C ", "\uE38C "], // helper
    ["\uE39D ", "\uE38D "], // vip
    ["\uE39E ", "\uE38E "], // ultra
    ["\uE39F ", "\uE38F "], // influencer
]);
/* stole this character width key from a bukkit forum (https://bukkit.org/threads/formatting-plugin-output-text-into-columns.8481/):
A: 6    B: 6    C: 6    D: 6    E: 6    F: 6    G: 6    H: 6   *I: 4*   J: 6    K: 6    L: 6    M: 6
N: 6    O: 6    P: 6    Q: 6    R: 6    S: 6    T: 6    U: 6    V: 6    W: 6    X: 6    Y: 6    Z: 6
a: 6    b: 6    c: 6    d: 6    e: 6   *f: 5*   g: 6    h: 6   *i: 2*   j: 6   *k: 5*  *l: 3*   m: 6
n: 6    o: 6    p: 6    q: 6    r: 6    s: 6   *t: 4*   u: 6    v: 6    w: 6    x: 6    y: 6    z: 6
 *(space): 4*  *!: 2*  **: 5*   -: 6   *.: 2*  *<: 5*  *>: 5*   ?: 6    +: 6    ,: 2    :: 2    ;: 2

evidently i didn't care about symmetry
*/
const classicBadgeMap = new Map([
    ["\uE396 ", "\xa78[\xa7eE\xa76L\xa7cI\xa7dT\xa75E\xa78]\xa7r "], // elite + ultra (gradient)
    ["\uE399 ", "\xa78[\xa7eELITE\xa78]\xa7r "], // elite (yellow)
    ["\uE39A ", "\xa78[\xa77PLAYER\xa78]\xa7r "], // player (light gray or white)
    ["\uE39B ", "\xa78[\xa79STAFF\xa78]\xa7r "], // staff (blue)
    ["\uE39C ", "\xa78[\xa72HELPER\xa78]\xa7r "], // helper (green)
    ["\uE39D ", "\xa78[\xa7dVIP\xa78]\xa7r "], // vip (gold or pink)
    ["\uE39E ", "\xa78[\xa75ULTRA\xa78]\xa7r "], // ultra (purple)
    ["\uE39F ", "\xa78[\xa7cINFLUENCER\xa78]\xa7r "], // influencer (red)
]);
const classicPrestigeMap = new Map([
    ["\uE4D9", "\xa78(\xa7nP1\xa78)\xa7r "], // p1 (bronze)
    ["\uE4DA", "\xa78(\xa7iP2\xa78)\xa7r "], // p2 (iron)
    ["\uE4DB", "\xa78(\xa7gP3\xa78)\xa7r "], // p3 (gold)
    ["\uE4DC", "\xa78(\xa7uP4\xa78)\xa7r "], // p4 (amethyst)
    ["\uE4DD", "\xa78(\xa7sP5\xa78)\xa7r "], // p5 (diamond)
]);
const classicServerMap = new Map([
    ["\uE3B9 ", "\xa78[\xa7dNOTICE\xa78]\xa7r "], // notice
    ["\uE3BA ", "\xa78[\xa72JOIN\xa78]\xa7r "], // join
    ["\uE3BB ", "\xa78[\xa74WARN\xa78]\xa7r "], // warn
    ["\uE3BC ", "\xa78[\xa7eINFO\xa78]\xa7r "], // info
    ["\uE3BD ", "\xa78[\xa7aGAME\xa78]\xa7r "], // game
    ["\uE3BE ", "\xa78[\xa73TEAM\xa78]\xa7r "], // team
    ["\uE3BF ", "\xa78[\xa75PARTY\xa78]\xa7r "], // party
]);

const minecraftColors: (Color | null)[] = [
    col("000000"), // 0: black
    col("0000AA"), // 1: dark blue
    col("00AA00"), // 2: dark green
    col("00AAAA"), // 3: dark aqua
    col("AA0000"), // 4: dark red
    col("AA00AA"), // 5: dark purple
    col("FFAA00"), // 6: gold/orange
    col("C6C6C6"), // 7: gray
    col("555555"), // 8: dark gray
    col("5555FF"), // 9: blue
    col("55FF55"), // a: green
    col("55FFFF"), // b: aqua
    col("FF5555"), // c: red
    col("FF55FF"), // d: light purple (pink)
    col("FFFF55"), // e: yellow
    col("FFFFFF"), // f: white
    col("DDD605"), // g: minecoin
    col("E3D4D1"), // h: quartz
    col("CECACA"), // i: iron
    col("443A3B"), // j: netherite
    null,          // k: index k is not a color
    null,          // l: index l is not a color
    col("971607"), // m: redstone
    col("B4684D"), // n: copper
    null,          // o: index o is not a color
    col("DEB12D"), // p: gold
    col("47A036"), // q: emerald
    null,          // r: index r is not a color
    col("2CBAA8"), // s: diamond
    col("21497B"), // t: lapis
    col("9A5CC6"), // u: amethyst
];

client.on("receive-chat", c => {
    if(notOnGalaxite()) return;
    if(c.cancel) return;
    if(!chatEditor.isEnabled()) return;

    let editedMessage = c.message; // cache a message to edit and resend later

    // NAME COLOR
    nameColor:
    if(optionOverrideNameColor.getValue().a > 0.8) { // if there is no transparency in the color (treated as an enabled setting)
        if(!rgxBadges.test(editedMessage)) break nameColor; // name color should only be changed on player-sent messages
        if(!editedMessage.includes(game.getLocalPlayer()!.getName())) break nameColor;

        c.cancel = true;

        // Find the best color
        let bestIndex: number = 7; // gray by default just in case
        let bestDistance: number = 4; // Max sum of squares is 3. This guarantees that it will be set on the first iteration.
        let playerColor: Color = optionOverrideNameColor.getValue();
        minecraftColors.forEach((color, index) => {
            if(color) {
                let distance = sumOfSquares((color.r - playerColor.r), (color.g - playerColor.g), (color.b - playerColor.b));
                if(distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = index;
                }
            }
        });

        // Apply the color
        const playerName = game.getLocalPlayer()!.getName();
        editedMessage = editedMessage.replace(playerName, `\xA7${
            bestIndex.toString(36) + playerName
        }`);
    }

    // PRESTIGES
    if(optionClassicPrestigeIcons.getValue()) { // classic
        if(rgxPrestiges.test(editedMessage)) {
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxPrestiges, (substring) => {
                return classicPrestigeMap.get(substring) ?? substring;
            });
        }
    }
    if(optionHidePrestigeIcons.getValue()) { // hidden
        if(rgxPrestiges.test(editedMessage)) { // check if message has a prestige icon
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxPrestiges, ""); // delete the prestige icon
        }
    }

    // BADGES
    if(optionRemoveBadges.getValue()) { // delete player badges first
        if(rgxPlayerBadges.test(editedMessage)) { // check if message has a player badge
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxPlayerBadges, ""); // delete the player badge
        }
    }
    if(optionCompactBadges.getValue()) { // shorten
        if(editedMessage.includes("\uE396")) { // check for elite & ultra
            c.cancel = true;
            editedMessage = editedMessage.replace(
                "\uE396", optionComboToggle.getValue() ? "\uE389" : "\uE38E" // replace combo badge with short elite if option is on, short ultra if off
            );
        }
        else if(rgxBadges.test(editedMessage)) { // check for any badge except elite & ultra
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxBadges, (substring) => { // get the matching badge
                return shortbadgeMap.get(substring) ?? substring; // use the matching badge as a key in the badge -> short badge map; if there's an error just return the long badge
            });
        }
    }
    if(optionClassicBadges.getValue()) { // classic
        if(rgxAllBadges.test(editedMessage)) {
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxAllBadges, (substring) => {
                return classicBadgeMap.get(substring) ?? substring;
            });
        }
    }

    // SERVER BADGES
    if(optionClassicServerBadges.getValue()) {
        if(rgxServerBadges.test(editedMessage)) {
            c.cancel = true;
            editedMessage = editedMessage.replace(rgxServerBadges, (substring) => {
                return classicServerMap.get(substring) ?? substring;
            });
        }
        if(editedMessage.includes(" \xA7e\xA7l\xBB\xA7r ")) { // \xBB is », used for galaxite player messages
            c.cancel = true;
            editedMessage = editedMessage.replace(" \xA7e\xA7l\xBB\xA7r ", "\xA7r: ");
        }
    }

    if(c.cancel)
        clientMessage(editedMessage.trim()); // if the message was changed, cancel the source message and resend the edited one
});

/**
 * Returns the color represented by the hex code.
 */
function col(hex: string): Color {
    return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: 1,
        asAlpha: Color.prototype.asAlpha // this is stupid
    };
}

function sumOfSquares(...nums: number[]): number {
    let sum = 0;
    nums.forEach((value) => {
        sum += Math.pow(value, 2);
    });
    return sum;
}