// Global Messages: Assorted global messages for informational purposes

import { notOnGalaxite, sendGXUMessage, gxuSplashes, patchNotes } from "./exports";
const http = require("http");
const fs = require("filesystem");

// initialization
let modGlobalMessages = new Module(
    "globalmessages",
    "GXU: Global Messages",
    "Configures what GalaxiteUtils-related messages should be sent. (The toggle state of this module is useless)",
    KeyCode.None
);
let optionSplashText = modGlobalMessages.addBoolSetting(
    "gxuactive",
    "GalaxiteUtils Splashes",
    "Sends a fun message upon joining Galaxite",
    true
);
client.getModuleManager().registerModule(modGlobalMessages);

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
            sendGXUMessage(patchNotes.get(plugin.version) ?? `Something went wrong when getting the patch notes! (version: ${util.bufferToString(fs.read(versionPath))})`);
        }

        // updater notifications (i do not want this to be an option)
        let githubRaw = http.get("https://raw.githubusercontent.com/LatiteScripting/Scripts/master/Plugins/GalaxiteUtils/plugin.json", {});
        if(githubRaw.statusCode == 200) { // if github sent a response
            let githubInterpretation = util.bufferToString(githubRaw.body);
            let onlineJson = JSON.parse(githubInterpretation);
            if(onlineJson.version != plugin.version) {
                sendGXUMessage(`A GalaxiteUtils update (v${onlineJson.version}) is available! Run \xa7l.plugin install GalaxiteUtils\xa7r and relaunch the client to update.`);
            }
        }
    }, 5000);
});

// client.on("key-press", e => { // debug function comment this for release
//     if(!e.isDown) return;
//     if(e.keyCode == KeyCode.K)
//         sendGXUMessage(getSplash());
// });

function getSplash(): string {
    return gxuSplashes[
        Math.floor(Math.random() * gxuSplashes.length)
    ];
}