// A few common functions for use across files.
// Put this everywhere:
// import { notOnGalaxite } from "./exports";

import { api } from "./WhereAmAPI";

const http = require("http");
const fs = require("filesystem");
const clipboard = require("clipboard");

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
 * @param messages The messages to send.
 */
export function sendGXUMessage(...messages: any[]) {
    messages.forEach((message) => {
        clientMessage(`\xA78[\xA7t${        // formatted opening square bracket
            optionShortGXUBadge.getValue()  // if short badges:
            ? "GXU"                         // just gxu
            : "Galaxite\xA7uUtils"          // otherwise, full galaxiteutils
        }\xA78]\xA7r ${message}`);          // formatted closing square bracket and message
    });
}

let globals = new Module(
    "globalmessages", // old name, kept for legacy support
    "GXU: Global Settings",
    "Configures assorted GalaxiteUtils behaviors. (The toggle state of this module is useless)",
    KeyCode.None
);
let optionSplashText = globals.addBoolSetting(
    "gxuactive",
    "GalaxiteUtils Splashes",
    "Sends a fun message upon joining Galaxite!",
    true
);
export let optionWhereAmIDelay = globals.addNumberSetting(
    "whereamidelay",
    "/whereami Delay",
    "The delay between joining a server and running /whereami for some module updates, in seconds.\nValues set too low may cause the message to fail, while values set too high may be sent after fast server transfers.",
    0,
    10.0,
    0.1,
    2.5
);
export let optionHideResponses = globals.addBoolSetting(
    "hideresponse",
    "Hide automatic /whereami responses",
    "Hides responses of automatically-sent /whereami commands.",
    true
);
let optionUseCopyWhereAmI = globals.addBoolSetting(
    "usecopywhereami",
    "Enable /whereami Copying",
    "Allows copying the last /whereami response.",
    false
);
let optionCopyWhereAmI = globals.addKeySetting(
    "copywhereami",
    "/whereami Copy Key",
    "Key used to copy the last response of /whereami.",
    KeyCode.P
);
export let optionShortGXUBadge = globals.addBoolSetting(
    "shortgxu",
    "Shorten GalaxiteUtils Badge",
    "Use a shorter version of the GalaxiteUtils icon.",
    false
);
export let optionAutoUpdate = globals.addBoolSetting(
    "autoupdate",
    "Auto Update",
    "Whether to automatically download plugin updates.\nRelaunching the game is still required if this is enabled.",
    false
);
optionCopyWhereAmI.setCondition("usecopywhereami");
client.getModuleManager().registerModule(globals);

// get and compare version from last launch
let version = plugin.version;
let updated: boolean;
let versionPath = "GalaxiteUtilsVersion";

// make the file if needed
if(fs.exists(versionPath)) { // if there is a version stored
    let storedVersion = util.bufferToString(fs.read(versionPath)); // read the file
    updated = (version != storedVersion); // set whether the plugin has updated to the opposite of whether the versions match
}
else {
    updated = true;
}
fs.write(versionPath, util.stringToBuffer(version)); // regardless of stored version, update (or create) the version file

// send messages
client.on("join-game", e => {
    if(notOnGalaxite()) return;

    setTimeout(() => {
        // splash texts
        if(optionSplashText.getValue()) {
            sendGXUMessage(getSplash());
        }

        // patch notes
        if(updated) {
            sendGXUMessage(patchNotes.get(plugin.version) ?? `Something went wrong when getting the patch notes! (version: v${util.bufferToString(fs.read(versionPath))})`);
        }

        // updater notifications (i do not want this to be an option)
        let githubRaw = http.get("https://raw.githubusercontent.com/LatiteScripting/Scripts/master/Plugins/GalaxiteUtils/plugin.json", {});
        if(githubRaw.statusCode == 200) { // if github sent a response
            let githubInterpretation = util.bufferToString(githubRaw.body);
            let onlineJson = JSON.parse(githubInterpretation);
            if(onlineJson.version != plugin.version) {
                if(optionAutoUpdate.getValue()) {
                    let success = client.runCommand("plugin install GalaxiteUtils"); // this also runs the command
                    if(success) {
                        sendGXUMessage(`GalaxiteUtils v${onlineJson.version} has been downloaded! Relaunch the game to finish updating.`);
                    }
                    else {
                        sendGXUMessage(`\xA74Auto-update failed; falling back to manual updating`);
                        sendGXUMessage(`A GalaxiteUtils update (v${onlineJson.version}) is available! Run \xA7l${
                            client.getCommandManager().getPrefix()
                        }plugin install GalaxiteUtils\xA7r and relaunch the client to update.`);
                    }
                }
                else {
                    sendGXUMessage(`A GalaxiteUtils update (v${onlineJson.version}) is available! Run \xA7l${
                        client.getCommandManager().getPrefix() // don't hardcode plugin prefix
                    }plugin install GalaxiteUtils\xA7r and relaunch the client to update.`);
                }
            }
        }
    }, 5000);
});

client.on("key-press", k => {
    if(notOnGalaxite()) return;
    if(!k.isDown) return;
    if(game.isInUI()) return;
    if(!optionUseCopyWhereAmI.getValue()) return;
    if(k.keyCode != optionCopyWhereAmI.getValue()) return;

    let whereami = (
        `\`\`\`Username: ${api.username}` +
        `\nServerUUID: ${api.serverUUID}` +
        `\nPodName: ${api.podName}` +
        `\nServerName: ${api.serverName}` +
        `\nCommitID: ${api.commitID}` +
        `\nShulkerID: ${api.shulkerID}` +
        `\nRegion: ${api.region}` +
        `\nPrivacy: ${api.privacy}` +
        ((api.parkourUUID)
        ? `\nParkourUUID: ${api.parkourUUID}`
        : "") +
        "```"
    );
    clipboard.set(whereami);
    sendGXUMessage("Copied the current server information to clipboard!");
});

function getSplash(): string {
    return gxuSplashes[
        Math.floor(Math.random() * gxuSplashes.length)
    ];
}

/**
 * A collection of splash texts.
 */
export const gxuSplashes = [
    "\xA7cHap\xA76py \xA7ePri\xA7ade \xA79Mon\xA75th!", // hate that i'll need to remove this after june :(
    "\xA76w\xA7po\xA7em\xA7fe\xA7un\xA7d,\xA75,", // lesbian
    "\xA73gay\xA7s ga\xA7by h\xA7fomo\xA79sex\xA71ual \xA75gay", // gay
    "\xA7cWhy \xA75not \xA79both?", // bi
    "\xA7bTrans \xA7drights \xA7fare \xA7dhuman \xA7brights!", // trans
    "\xA78N\xA77o\xA7fp\xA75e", // asexual
    "\xA7eWhat \xA7feven \xA75is \xA78gender?", // non-binary
    "GalaxiteUtils is queer-coded because I'm queer and I coded (it)", // https://twitter.com/kezzdev/status/1735408562791219626
    "Let's paint this gray haze into sky blue!",
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
    "Made with 99.5% pure TypeScript!",
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
    "252+ SpA Choice Specs Beads of Ruin Chi-Yu Overheat vs. 0 HP / 0- SpD Sniper-Playground in Sun: 40584-47744 (27988.9 - 32926.8%) -- guaranteed OHKO",
    "What's a meta, anyway?",
    "Does not help with escaping the Entity",
    "Sonic Snowballs were such a good item Mojang added them officially",
    "Currently Latite's largest plugin!",
    "Exposes no internal information!",
    "d-d-a g",
    "Woomy!",
    "amogus",
    'client.on("join-game", e => clientMessage("This is valid Latite plugin code") );',
    "5D Parkour Builders with Multiverse Time Travel",
    "There is 1 tester and it is myself",
    'In JS, "([]+{})[!![]+!![]]" is the same thing as "b". Don\'t ask.',
    "727!!!!!!! 727!! When you see it!!!!!!!",
    "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA",
    "!bsr 25f",
    `When \xA76server\xA7r is selected, destroy previously sent splash text and permanently add \xA76double\xA7r its character length to your \xA7bGems\xA7r next login \xA78(Currently \xA7b+${
        Math.round(Math.random() * 31)
        }\xA78 Gems)\xA7r`,
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
];

/**
 * A map between the updated-to version and the changes included in that version.
 */
export const patchNotes = new Map([
    ["0.2.3", "How?"],
    ["0.2.4", "GalaxiteUtils v0.2.4 was never released. \xA7lWake up.\xA7r"], // for those looking at the code, i used 0.2.4 as a placeholder while making 0.3.0
    ["0.3.0", "GalaxiteUtils has been updated to v0.3.0!\n" +
        "- Added splash texts to confirm that the plugin is active (can be toggled using the new Global Messages module)\n" +
        "- Added notifications when an update is available\n" +
        "- Added patch note notifications like seen here\n" +
        '- Chat Debloat: Added options to remove the "Welcome to Galaxite" and "You are now (in)visible messages\n' +
        "- WhereAmIHUD: ParkourUUID now has its own settings and is positioned above developer fields\n" +
        "- WhereAmIHUD: If Hide Response is enabled, all /whereami responses will now be hidden (this fixes some issues with rapid server transfers)\n" +
        "  - 0.4.0 will add a new way of handling sending /whereami commands that \xA7oshould\xA7r make this not happen as often\n" +
        "- Fixed a bug (hopefully) where prestige icons occasionally caused the Compact Badges module to not work as expected\n" +
        "- Fixed WhereAmIHUD not properly handling ParkourUUID\n" +
        "- Various backend changes\n" +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
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
    ["0.3.5", "GalaxiteUtils has been updated to v0.3.5!\n" +
        "- Fixed WhereAmIHUD breaking due to Galaxite updating the command response (it shouldn't break as badly in the future, too!)\n" +
        "- Made some very large backend changes that should make some modules more stable (ex. /whereami is no longer sent twice with WhereAmIHUD and AutoGG on in Prop Hunt)\n" +
        "- You can make /whereami run sooner after changing servers, reducing the chance of results accidentally showing\n" +
        "- You can now allow the plugin to update automatically\n" +
        "  - This does still require relaunching the game\n" +
        "- Plugin update notifications no longer assume you use . as your command prefix\n" +
        "- Hiding automatic /whereami responses is now handled using an option in the Global Settings module, not WhereAmIHUD\n" +
        "- Compact Badges has been expanded into a full chat editor, with multiple new options including traditional badges\n" +
        "- You can now shorten GalaxiteUtils badges using the Global Settings module\n" +
        "- A command that allows copying /whereami data has been internally added ('export', 'copywhereami', or 'whereami'), though is currently non-functional due to an upstream bug\n" +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)"
    ],
    ["0.3.6", "GalaxiteUtils has been updated to v0.3.6!\n" +
        "- Confirm Extra Things has been renamed to Confirm Item Use and has a new option to work on shops (experimental). Thanks @xjayrex for the idea!\n" +
        "- The setting controlling Confirm Item Use is now stored and displayed in seconds\n" +
        "  - The setting should reset to 0.5 seconds, if it doesn't any manual change should update it\n" +
        "- Fixed a bug in Chat Editor where Prestige icons could not be hidden or made classic\n" +
        "- Added a lot of Pride splashes!\n" +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)"
    ],
    ["0.4.0", "GalaxiteUtils has been updated to v0.4.0!\n" +
        "- New module: Attempt Counter (for Parkour Builders)\n" +
        "  - This includes displays for the current session's attempts and all-time attempts!" +
        "- New module: Auto-Modules (for Chronos, The Entity, and Alien Blast)\n" +
        "- You can now bind a button to copy the information of the current server you're in within the Global Settings module\n" +
        "- Chat Editor is no longer always active\n" +
        "- Changed a lot of module and setting descriptions\n" +
        "\nRemember to report any bugs you find! Ping @1unar_Eclipse on the Galaxite or Latite Discord or open an issue at https://github.com/1unar-Eclipse/GalaxiteUtils.\n" +
        "(press your chat button to view full patch notes)"
    ]
]);