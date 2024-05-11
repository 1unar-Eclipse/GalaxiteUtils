// Global Messages: Assorted global messages for informational purposes

import { notOnGalaxite, sendGXUMessage } from "./exports";
const http = require("http");


let modGlobalMessages = new Module(
    "globalmessages",
    "GXU: Global Messages",
    "Configures what GalaxiteUtils-related messages should be sent",
    KeyCode.None
);

let optionUpdateNotifications = modGlobalMessages.addBoolSetting(
    "updatenotifications",
    "Update Notifications",
    "Sends a message when an update is detected (you probably shouldn't disable this)",
    true
);
let optionSplashText = modGlobalMessages.addBoolSetting(
    "gxuactive",
    "GalaxiteUtils Splashes",
    "Sends a fun message upon joining Galaxite",
    true
);

client.getModuleManager().registerModule(modGlobalMessages);

client.on("join-game", e => {
    if(notOnGalaxite()) return;

    setTimeout(() => {
        if(optionSplashText.getValue()) {
            sendGXUMessage(getSplash());
        }
        if(optionUpdateNotifications.getValue()) {
            if(
                JSON.parse( // interpret as a json
                    util.bufferToString(
                        http.get("https://raw.githubusercontent.com/LatiteScripting/Scripts/master/Plugins/GalaxiteUtils/plugin.json") // get the current online plugin data
                        .body // use the actual text
                    )
                ).version // get the version of the online plugin
                != plugin.version // if the versions do not match, there is an update
            ) {
                sendGXUMessage("A GalaxiteUtils update is available! Run .plugin install GalaxiteUtils and relaunch the game to update.")
            }
        }
    }, 2000);
});

client.on("key-press", e => {
    if(!e.isDown) return;
    if(e.keyCode == KeyCode.K)
        sendGXUMessage(getSplash());
})

let gxuSplashes = [
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
    "Less spammy than hub messages!",
    "GalaxiteUtils active!",
    "HiveUtils active..?",
    "CubeCraftUtils active..?",
    ":3",
    "is ACTIVE",
    "Made with 95% pure TypeScript!",
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
    "galaxite season 9 or hollow knight silksong",
    "PC-exclusive!",
    "Controller isn't a bad input method y'all just don't know how to use steam input",
    "It's ironic that a plugin with 2 modules dedicated to trimming chat added splash texts",
    "252+ SpA Choice Specs Beads of Ruin Chi-Yu Overheat vs. 0 HP / 0 SpD Sniper Main in Sun: 18120-21316 (12496.5 - 14700.6%) -- guaranteed OHKO",
    "noqvniuwbvibvioqwavbqoinvcoanvoiadncv",
    "What's a meta, anyway?",
    "Does not help with escaping the Entity",
    "Sonic Snowballs were such a good item Mojang added them officially",
    "Also try MCC Island!",
    "Currently Latite's largest plugin!",
    "Exposes no internal information!",
    "d-d-a g",
    "Woomy!",
    "amogus",
    'client.on("join-game", e => { clientMessage("This is valid Latite plugin code") });',
    "5D Parkour Builders with Multiverse Time Travel",
    "There is 1 tester and it is myself",
    "Trans rights!",
    'In JS, "([]+{})[!![]+!![]]" is the same thing as "b". Don\'t ask.',
    "727!!!!!!! 727!! When you see it!!!!!!!",
    "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA",
    "!bsr 25f",
    "When \xa76server\xa7r is selected, destroy previously sent splash text and permanently add \xa76double\xa7r its character length to your \xa7bGems\xa7r next login \xa78(Currently \xa7b+0\xa78 Gems)\xa7r"
];
function getSplash(): string {
    return gxuSplashes[
        Math.floor(Math.random() * gxuSplashes.length)
    ]
}