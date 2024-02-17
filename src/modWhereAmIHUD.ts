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
    "Makes the server name field use proper formatting (currently does nothing)",
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

// Cache whether /whereami was sent automatically
let whereAmISent: boolean = false;

// Send /whereami every time a server is joined
client.on("join-game", e => {
    if(notOnGalaxite()) return;
    whereAmISent = true;
    game.executeCommand("/whereami");
});

// Handle the response

/* Sample response:

\xbc\x20\xa7cServerUUID: \xa7a93e0a641-bc66-4e34-b918-e0ff23684997
\xa7cPodName: \xa7amainhub-b-665d8f7bf-kqrjq
\xa7cServerName: \xa7aMainHub
\xa7cCommitID: \xa7a975198ad
\xa7cShulkerID: \xa7afd53c2d3-8ed9-4d2d-a850-3938b1109dc5
\xa7cRegion: \xa7aus
\xa7cPrivacy: \xa7aPublic

equivalent to:
ServerUUID: 93e0a641-bc66-4e34-b918-e0ff23684997
PodName: mainhub-b-665d8f7bf-kqrjq
ServerName: MainHub
CommitID: 975198ad
ShulkerID: fd53c2d3-8ed9-4d2d-a850-3938b1109dc5
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

*/

// hook
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    if(msg.message.includes("\xbc\x20\xa7cServerUUID: ")) { // there is no shot a user can send that
        let formattedMessage = msg.message.replace("\xbc\x20", ""); // cache message
        let entries = formattedMessage.split("\n\xa7c"); // Split up the response at this substring, in the process splitting by line
        for(let i = 0; i < entries.length; i++) { // For each entry:
            entries[i] = entries[i].split(" \xa7a")[1]; // Save only the part of the response after the category name
        }

        // serverUUID = entries[0];
        // podName = entries[1];
        // serverName = entries[2];
        // commitID = entries[3];
        // shulkerID = entries[4];
        // region = entries[5];
        // privacy = entries[6];

        [serverUUID, podName, serverName, commitID, shulkerID, region, privacy] = entries; // Store the entries to cache
        parkourUUID = (entries.length > 7) ? entries[7] : ""; // If ParkourUUID was sent, add it; otherwise store an empty string for it (is this needed?)

        if(optionHideResponse.getValue()) { // if the user chooses to hide the response
            if(whereAmISent) { // if the plugin has already sent /whereami
                msg.cancel = true;
                whereAmISent = false;
            }
        }
    }
});

// Cache new line (very important) (i use it a lot here)
const NL = "\n";

// Actually render stuff
whereAmIHUD.on("text", () => {
    if(notOnGalaxite()) return("");

    // initialize render variable
    let render = "";

    // consider options and build text
    if(optionServerName.getValue())
        render = render.concat(serverName, NL); // todo: manage format option
    if(optionRegion.getValue())
        render = render.concat(region.toUpperCase(), NL); // Uppercase region, as the server sends it lowercase
    if(optionPrivacy.getValue())
        render = render.concat(privacy + " Game", NL);
    if(optionDevFields.getValue()) {
        render = render.concat(serverUUID, NL, podName, NL, commitID, NL, shulkerID, NL, parkourUUID); // no final NL since that's always the last data point
    }

    // remove possible trailing \n
    render = render.trim();

    // return finalized text
    return render;
});