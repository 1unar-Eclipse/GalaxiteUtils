// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.

export { }; // this is so a bandage fix
let notOnGalaxite = require("./exports");

// Initialization
let whereAmIHUD = new TextModule(
    "whereAmIHUD",
    "WhereAmIHUD",
    "Automatically runs /whereami on every server join, and shows selected details",
    KeyCode.None,
);
client.getModuleManager().registerModule(whereAmIHUD);

client.on("unload-script", scr => {
    if(scr.scriptName === "GalaxiteUtils") {
        client.getModuleManager().deregisterModule(whereAmIHUD);
    }
});

// Initialize Settings
let optionServerName = whereAmIHUD.addBoolSetting(
    "ServerName",
    "Server Name",
    "Shows the ServerName (game name) field",
    true
);
let optionFormatServerName = whereAmIHUD.addBoolSetting(
    "FormatServerName",
    "Format Server Name",
    "Makes the server name field use proper formatting",
    true
);
let optionRegion = whereAmIHUD.addBoolSetting(
    "Region",
    "Region",
    "Shows the Region field",
    true
);
let optionPrivacy = whereAmIHUD.addBoolSetting(
    "Privacy",
    "Privacy",
    "Shows the Privacy (public/private game) field",
    true
);
let optionDevFields = whereAmIHUD.addBoolSetting(
    "DevFields",
    "Developer Fields",
    "Shows details less important to normal users (ServerUUID, PodName, CommitID, and ShulkerID, plus ParkourUUID in Parkour Builders)",
    false
);
let optionHideResponse = whereAmIHUD.addBoolSetting(
    "HideResponse",
    "Hide Response",
    "Runs command in the background without a chat message (disable if normal /whereami doesn't work)",
    true
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
});

// Handle the response
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    // TODO: figure out how galaxite sends the whereami anyway
});

// Cache new line (very important) (i use it a lot here)
const NL = "\n";

// Actually render stuff
whereAmIHUD.on("text", (isPreview = true, isEditor = true) => {
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