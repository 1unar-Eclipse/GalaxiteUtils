// Global Messages: Assorted global messages for informational purposes

import { notOnGalaxite, sendGXUMessage, gxuSplashes } from "./exports";
const http = require("http");


let modGlobalMessages = new Module(
    "globalmessages",
    "GXU: Global Messages",
    "Configures what GalaxiteUtils-related messages should be sent",
    KeyCode.None
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
        if(optionSplashText.getValue()) { // splash texts
            sendGXUMessage(getSplash());
        }

        // updater notifications (i do not want this to be an option)
        let githubRaw = http.get("https://raw.githubusercontent.com/LatiteScripting/Scripts/master/Plugins/GalaxiteUtils/plugin.json");
        if(githubRaw.statusCode == 200) {
            let githubInterpretation = util.bufferToString(githubRaw.body);
            let onlineJson = JSON.parse(githubInterpretation);
            if(onlineJson.version != plugin.version) {
                sendGXUMessage("A GalaxiteUtils update is available! Run .plugin install GalaxiteUtils and relaunch the client to update.")
            }
        }
    }, 5000);
});

client.on("key-press", e => { // debug function comment this for release
    if(!e.isDown) return;
    if(e.keyCode == KeyCode.K)
        sendGXUMessage(getSplash());
});

function getSplash(): string {
    return gxuSplashes[
        Math.floor(Math.random() * gxuSplashes.length)
    ]
}