// Globals: Assorted global messages and settings.
// GlobalMessages file name is used for legacy compatibility.

import { notOnGalaxite, sendGXUMessage, gxuSplashes, patchNotes } from "./exports";
const http = require("http");
const fs = require("filesystem");

// initialization
let modGlobals = new Module(
    "globalmessages", // old name, kept for legacy support
    "GXU: Global Settings",
    "Configures assorted GalaxiteUtils behaviors. (The toggle state of this module is useless)",
    KeyCode.None
);
let optionSplashText = modGlobals.addBoolSetting(
    "gxuactive",
    "GalaxiteUtils Splashes",
    "Sends a fun message upon joining Galaxite",
    true
);
export let optionWhereAmIDelay = modGlobals.addNumberSetting(
    "whereamidelay",
    "/whereami Delay",
    "The delay between joining a server and running /whereami for some module updates, in seconds.\n\nValues set too low may cause the message to fail, while values set too high may be sent after fast server transfers.",
    0,
    10.0,
    0.1,
    2.5
);
export let optionHideResponses = modGlobals.addBoolSetting(
    "hideresponse",
    "Hide automatic /whereami responses",
    "Hides responses of automatically-sent /whereami commands.",
    true
);
export let optionShortGXUBadge = modGlobals.addBoolSetting(
    "shortgxu",
    "Shorten GalaxiteUtils Badge",
    "Use a shorter version of the GalaxiteUtils icon",
    false
);
client.getModuleManager().registerModule(modGlobals);

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
                sendGXUMessage(`A GalaxiteUtils update (v${onlineJson.version}) is available! Run \xa7l${
                    client.getCommandManager().getPrefix() // don't hardcode plugin prefix
                }plugin install GalaxiteUtils\xa7r and relaunch the client to update.`);
            }
        }
    }, 5000);
});

function getSplash(): string {
    return gxuSplashes[
        Math.floor(Math.random() * gxuSplashes.length)
    ];
}