// A few common functions for use across files.
// Put this everywhere:
// import { notOnGalaxite } from "./exports";

import { optionShortGXUBadge } from "./modGlobalMessages";

/**
* Returns `true` if the player is not on Galaxite; `false` if they are.
*/
export function notOnGalaxite(): boolean {
    // return true if you are on anything BUT Galaxite. this way I can just do `if(notOnGalaxite()) return;` on every client.on()
    return (game.getFeaturedServer() != "Galaxite");
}
/**
* Returns `true` if the player is a Galaxite nerd; `false` if they aren't.
*/
const galaxiteNerds = [
    "ThatJadon 26",
    "Eclipse2421",
    "AJckk",
    "GalaxiteAJ",
    "A2K Delta133",
    "SpinaRosam"
];
export function nerdRadar(): boolean {
    // If the person is a Galaxite nerd (a wiki team member), return as true
    return galaxiteNerds.includes(game.getLocalPlayer()!.getName());
}


/**
 * Sends a formatted message to chat.
 * @param message The message to use.
 */
export function sendGXUMessage(message: string) {
    clientMessage(`\xa78[\xa7t${        // formatted opening square bracket
        optionShortGXUBadge.getValue()  // if short badges:
        ? "GXU"                         // just gxu
        : "Galaxite\xa7uUtils"          // otherwise, full galaxiteutils
    }\xa78]\xa7r ${message}`);          // formatted closing square bracket and message
}

/**
 * A collection of splash texts.
 */
export const gxuSplashes = [
    "Now with more utils!",
    "pve game",
    "Report issues at https://github.com/1unar-Eclipse/GalaxiteUtils, they're a huge help",
    "Made with love! (and a lot of nerd questions to galaxite and latite)",
    "Hello, would the owners of the Galaxite Minecraft server possibly consider selling the server, I would possibly be interested in purchasing the server if it is for sale. I am an influence in the League of Legends community and would like to expand into Minecraft, and I think the Galaxite server would be a good fit.",
    ":blessseb:",
    ":blessthedevs:",
    ":blessali:",
    ":blameseb:",
    ":blamecallun:",
    ":blamealex:",
    "GalaxiteUtils active!",
    "HiveUtils active..?",
    "CubeCraftUtils active..?",
    "PixelParadiseUtils disactive.",
    ":3",
    "is ACTIVE",
    "Made with 99.3% pure TypeScript!",
    "These aren't funny aren't they",
    "Open-source!",
    "Now with patch notes!",
    "Fact: Birds are hard to catch",
    "3... 2... 1...",
    "Prevents deaths to bad hotkeying!",
    "Keeps hub messages down!",
    "Trims badges!",
    "AutoGG currently has a permission issue", // this one here
    "Sends /whereami!",
    "if notOnGalaxite() return;",
    "Hundreds of lines of code just to store a command on screen smh just code better",
    "PC-exclusive!",
    "Controller isn't a bad input method y'all just don't know how to use steam input",
    "It's ironic that a plugin with 2 modules dedicated to trimming chat added splash texts",
    "252+ SpA Choice Specs Beads of Ruin Chi-Yu Overheat vs. 0 HP / 0 SpD Sniper Main in Sun: 18120-21316 (12496.5 - 14700.6%) -- guaranteed OHKO",
    "What's a meta, anyway?",
    "Does not help with escaping the Entity",
    "Sonic Snowballs were such a good item Mojang added them officially",
    "Currently Latite's largest plugin!",
    "Exposes no internal information!",
    "d-d-a g",
    "Woomy!",
    "amogus",
    'client.on("join-game", e => { clientMessage("This is valid Latite plugin code"); });',
    "5D Parkour Builders with Multiverse Time Travel",
    "There is 1 tester and it is myself",
    "Trans rights!",
    'In JS, "([]+{})[!![]+!![]]" is the same thing as "b". Don\'t ask.',
    "727!!!!!!! 727!! When you see it!!!!!!!",
    "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA",
    "!bsr 25f",
    `When \xa76server\xa7r is selected, destroy previously sent splash text and permanently add \xa76double\xa7r its character length to your \xa7bGems\xa7r next login \xa78(Currently \xa7b+${
        Math.round(Math.random() * 31)
        }\xa78 Gems)\xa7r`,
    "Allays are just Orbi's kids stop hiding the truth Mojang",
    "Problem: white flour (and whole wheat flour) have virtually no nutrition in comparison to actual wheat.",
    // `${(() => { // this is a dynamic keysmash. yes i'm putting too much effort into being gay while this is being used by minecraft bedrock players. yes this is the depths of javascript. no i do not care
    //     /* This code could probably generate some bad words by accident. Don't want to take the risk even if this is technically more pure
    //     let str = ""; // initialize empty string
    //     for(let i = 0; i < Math.floor(Math.random() * 21) + 20; i++) { // for 10-20 characters (*11 because floor removes the chance for 10 if i were to do *10 [ty seb])
    //         str = str.concat(String.fromCharCode(Math.floor(Math.random() * 26) + 97)); // append a random alphabetical character
    //     }
    //     return str;
    //     */
    // })()}`, // last parentheses make this run (ty melody)
    "scp-6113 my beloved",
    "scp-113 my beloved",
    "If you or a loved one has suffered from vitenout addiction, you may be entitled to financial compensation!",
    "ouewnbv9uwebv9uwbngv",
    "opiqwhnvoicsnvkwgw890fghuison",
    "e",
    "wwdeuubdefdqzukjkjyjadhwflr",
    "Remember to update your game from time to time!",
    "Powered by WhereAmAPI!",
    "\uE1E4", // this is the unused ph coin icon, which looks like an amogus
    "Let's paint this gray haze into sky blue!"
];

/**
 * A map between the updated-to version and the changes included in that version.
 */
export const patchNotes = new Map([
    ["0.2.3", "How?"],
    ["0.2.4", "GalaxiteUtils v0.2.4 was never released. \xa7lWake up.\xa7r"], // for those looking at the code, i used 0.2.4 as a placeholder while making 0.3.0
    ["0.3.0", "GalaxiteUtils has been updated to v0.3.0!\n" +
        "- Added splash texts to confirm that the plugin is active (can be toggled using the new Global Messages module)\n" +
        "- Added notifications when an update is available\n" +
        "- Added patch note notifications like seen here\n" +
        '- Chat Debloat: Added options to remove the "Welcome to Galaxite" and "You are now (in)visible messages\n' +
        "- WhereAmIHUD: ParkourUUID now has its own settings and is positioned above developer fields\n" +
        "- WhereAmIHUD: If Hide Response is enabled, all /whereami responses will now be hidden (this fixes some issues with rapid server transfers)\n" +
        "  - 0.4.0 will add a new way of handling sending /whereami commands that \xa7oshould\xa7r make this not happen as often\n" +
        "- Fixed a bug (hopefully) where prestige icons occasionally caused the Compact Badges module to not work as expected\n" +
        "- Fixed WhereAmIHUD not properly handling ParkourUUID\n" +
        "- Various backend changes\n\n" +
        "Remember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)" // lol
    ],
    ["0.3.1", "GalaxiteUtils has been updated to v0.3.1!\n" +
        "- The placeholder message for AutoGG not working is now a GalaxiteUtils message\n" +
        "- There is no longer a scary error message when AutoGG fails\n" +
        "- Actually fixed the Compact Badges module hiding ranks while the Hide Prestiges option was enabled\n" +
        "- Added specific nerd functionality for specific people. (by ThatJadon 26)\n" +
        "  - If you don't know what this means, don't worry about it, you're unaffected.\n" +
        "  - If you are affected by this, an option for it will appear after this functionality is used once and the game has been relaunched.\n" +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)"
    ],
    ["0.4.0", "GalaxiteUtils has been updated to v0.4.0!\n" +
        "- Fixed WhereAmIHUD breaking due to Galaxite updating the command response (it shouldn't break in the future, either!)" +
        "- Made some very large backend changes that should make some modules more stable\n" +
        "- You can now allow the plugin to update automatically\n" +
        "- New module: Attempt Counter (for Parkour Builders)\n" +
        "- New module: Auto-Modules (for Chronos, The Entity, and Alien Blast)\n" +
        "- New module: Kit UI (for Chronos, Hyper Racers, and Kit PvP; opt-in for Rush due to length)\n" +
        "- Hiding automatic /whereami responses is now handled using an option in the Global Settings module, not WhereAmIHUD\n" +
        "- Compact Badges has been expanded into a full chat editor, with multiple new options including traditional badges\n" +
        "- Plugin update notifications no longer assume you use . as your command prefix\n" +
        "- You can now shorten GalaxiteUtils badges\n" +
        '- The plugin now automatically downloads a resource pack that removes armor. Click the "Open Latite Folder" button next time you launch and import the pack there!\n' +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)"
    ]
]);

/**
 * random is `\uE1EB`
 */
export const chronosPerkMap = new Map([
    // OFFENSE
    ["Bow Start", "\uE115"], // tier 3 bow
    ["Prepare Shot", "\uE1C0"], // battery
    ["Sonic Snowballs", "\uE1C4"], // sonic snowball
    ["Daredevil", "\uE184"], // faded dark red player
    ["Solid Snowballs", "\uE119"], // snowball
    ["Glass Cannon", "\uE12B"], // playground glass cannon graphic
    ["Sniper", "\uE14D"], // playground sniper graphic
    ["Airstrike", "\uE12D"], // firework rocket
    ["Sword Specialist", "\uE112"], // netherite sword
    ["Assassin", "\uE1A2"], // playground assassin graphic
    ["Revenger", "\uE136"], // red skull
    ["Fireballs", "\uE11A"], // fire death icon
    ["Poison Arrows", "\uE114"], // tier 2 bow
    ["Bandit Boss", "\uE103"], // that code guy
    ["Levitation Arrows", "\uE11B"], // broken bone
    ["Time Siphon", "\uE138"], // hourglass

    // DEFENSE
    ["Tank", "\uE101"], // classic armor icon
    ["Health Scavenger", "\uE1A5"], // health pop-in
    ["Medicine", "\uE201"], // apple
    ["Blinding Forcefield", "\uE1A0"], // blindness icon
    ["Weakening Arrows", "\uE113"], // gray bow
    ["Vampire", "\uE10B"], // playground vampire icon
    ["Heavy Duty", "\uE12F"], // still anvil
    ["Hunker Down", "\uE247"], // statue
    ["Armour Specialist", "\uE10A"], // netherite armor
    ["Smoke Bomb", "\uE1A7"], // mirror / empty window
    ["Soul Collector", "\uE14B"], // soul
    ["Ancient", "\uE1D2"], // silver clock
    ["Shielder", "\uE1A8"], // shield
    ["Shattered Glass", "\uE129"], // cactus death icon
    ["Scaredy Cat", "\uE1DF"], // engine
    ["Trapper", "\uE12A"], // explosion death icon

    // UTILITY
    ["Mobility", "\uE19A"], // kart
    ["Backpack", "\uE1C2"], // open lock
    ["Builder", "\uE147"], // block
    ["Falcon", "\uE14F"], // feather
    ["Vault Raider", "\uE1C1"], // lock
    ["Scout", "\uE1A4"], // speed icon
    ["Sticky Arrows", "\uE1A3"], // snail
    ["Stealth Jet", "\uE1AC"], // particles
    ["Time Hoarder", "\uE139"], // gold clock
    ["Ninja", "\uE190"], // person
    ["Gravity Spheres", "\uE11C"], // bubbles
    ["Dasher", "\uE12C"], // trident
    ["Sparrow", "\uE193"], // dropship icon
    ["Soulbound", "\uE1A1"], // blue death icon
    ["Ghost", "\uE1AB"], // ghost nameplate icon
    ["Recon", "\uE1F7"], // red exclamation mark
    ["Lucky", "\uE1EC"], // present

    // BOUNTY - bounty char is \uE148
    ["Feedback Loop", "\uE148\uE19C"], // add player
    ["Contract of Blessing", "\uE148\uE1BD"], // gold plus
    ["Contract of Protection", "\uE148\uE10C"], // absorption heart
    ["Contract of Rewarding", "\uE148\uE1EC"], // present

    // TEAM - general team icon is \uE146
    ["Warper", "\uE146\uE14E"], // ender pearl
    ["Frontline", "\uE146\uE111"], // diamond sword
    ["Healer", "\uE146\uE10B"], // red heart
    ["Avenger", "\uE146\uE136"], // red skull
    ["Mayday", "\uE146\uE1A4"], // speed icon
    ["Freezer", "\uE146\uE1C5"], // ice slider
]);

client.on("key-press", k => {
    if(notOnGalaxite() || k.keyCode != KeyCode.K || !k.isDown) return;
    let str = "";
    chronosPerkMap.forEach((val, key) => {
        str = str.concat(key, ": ", val, "\n");
    });
    sendGXUMessage(str);
});