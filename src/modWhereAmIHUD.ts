// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.

import { notOnGalaxite, debugLog } from "./main";
// require("./index");

// Initialization
let mod = new TextModule(
    "WhereAmIHUD",
    "WhereAmIHUD",
    "Automatically runs /whereami on every server join, and shows selected details",
    KeyCode.None,
);
client.getModuleManager().registerModule(mod);

client.on("unload-script", scr => {
    if(scr.scriptName === script.name) {
        client.getModuleManager().deregisterModule(mod);
    }
});

// Initialize Settings
let optionServerName = mod.addBoolSetting(
    "ServerName",
    "Server Name",
    "Show the ServerName (game name) field",
    true
);
let optionFormatServerName = mod.addBoolSetting(
    "FormatServerName",
    "Format Server Name",
    "Makes the server name field use proper formatting",
    true
);
let optionRegion = mod.addBoolSetting(
    "Region",
    "Region",
    "Show the Region field",
    true
);
let optionPrivacy = mod.addBoolSetting(
    "Privacy",
    "Privacy",
    "Show the Privacy (public/private game) field",
    true
);
let optionDevFields = mod.addBoolSetting(
    "DevFields",
    "Developer Fields",
    "Shows details less important to normal users (ServerUUID, PodName, CommitID, and ShulkerID, plus ParkourUUID in Parkour Builders)",
    false
);
let optionHideResponse = mod.addBoolSetting(
    "HideResponse",
    "Hide Response",
    "Runs command in the background without a chat message (may cause potential issues)",
    false
);

/* Field list:
- ServerUUID (devFields)
- PodName (devFields)
- ServerName (serverName)
- CommitID (devFields)
- ShulkerID (devFields)
- Region (region)
- Privacy (privacy)

Order: ServerName, Region, Privacy, ServerUUID, PodName, CommitID, ShulkerID, ParkourUUID (if applicable)
*/

// Initialize storage strings (i love weakly typed languages)
let serverUUID: string,
    podName: string,
    serverName: string,
    commitID: string,
    shulkerID: string,
    region: string,
    privacy: string,
    parkourUUID: string;

// Send /whereami every time a server is joined
client.on("join-game", e => {
    if(notOnGalaxite()) return;
    game.executeCommand("/whereami");
    debugLog("whereami run");
});

// Handle the response
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    // TODO: figure out how galaxite sends the whereami anyway
});

// Cache new line (very important) (i use it a lot here)
const NL = "\n";

// Actually render stuff
mod.on("text", (isPreview = true, isEditor = true) => {
    if(notOnGalaxite()) return("");

    // initialize render variable
    let render = "";

    // consider options and build text
    if(optionServerName.getValue())
        render = render.concat(serverName, NL);
    if(optionRegion.getValue())
        render = render.concat(region, NL);
    if(optionPrivacy.getValue())
        render = render.concat(privacy, NL);
    if(optionDevFields.getValue()) {
        render = render.concat(serverUUID, NL, podName, NL, commitID, NL, shulkerID, NL, parkourUUID); // no final NL since that's always the last data point
    }

    // remove possible trailing \n
    render = render.trim();

    // return finalized text
    return render;
});