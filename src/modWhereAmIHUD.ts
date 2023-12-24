// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.

import { notOnGalaxite } from "./exports";

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

/* Sample response:
â€œî¼ Â§cServerUUID: Â§abf600766-140c-4295-9afe-1a83522ec741
Â§cPodName: Â§amainhub-b-86c8c98c6f-b7rhv
Â§cServerName: Â§aMainHub
Â§cCommitID: Â§acb6ce9c5
Â§cShulkerID: Â§ac384c47e-ba18-4007-8194-eb84e379a857
Â§cRegion: Â§aus
Â§cPrivacy: Â§aPublicâ€

equivalent to:
ServerUUID: bf600766-140c-4295-9afe-1a83522ec741
PodName: mainhub-b-86c8c98c6f-b7rhv
ServerName: MainHub
CommitID: cb6ce9c5
ShulkerID: c384c47e-ba18-4007-8194-eb84e379a857
Region: us
Privacy: Public

0: ServerUUID
1: PodName
2: ServerName
3: CommitID
4. ShulkerID
5: Region
6: Privacy
7?: ParkourUUID

â€œî¼ = INFO opener
Â = ??? seems to show up everywhere colors are involved
*/
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    if(msg.message.includes("â€œî¼ Â§cServerUUID:")) { // there is no shot a user can send that
        let formattedMessage = msg.message.replace("â€", ""); // Remove the ending random characters
        let entries = formattedMessage.split(": Â§a"); // Split up the response at this substring
        for(let i = 0; i < entries.length; i++) {
            entries[i] = entries[i].split("\nÂ§c")[0]; // Remove everything past the line split by splitting it at the line split, then only keeping the first entry
        }

        // serverUUID = entries[0];
        // podName = entries[1];
        // serverName = entries[2];
        // commitID = entries[3];
        // shulkerID = entries[4];
        // region = entries[5];
        // privacy = entries[6];

        [serverUUID, podName, serverName, commitID, shulkerID, region, privacy] = entries;
        parkourUUID = (entries.length > 7) ? entries[7] : ""; // is this needed?
    }
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