// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.

import { notOnGalaxite } from "./exports";
import * as w from "./WhereAmIHUDOptions";

// Initialization

/* Field list:
- ServerUUID (devFields)
- PodName (devFields)
- ServerName (serverName)
- CommitID (devFields)
- ShulkerID (devFields)
- Region (region)
- Privacy (privacy)

Order: ServerName, Region, Privacy, ServerUUID, PodName, CommitID, ShulkerID, ParkourUUID (if applicable)

Internal game names (for formatting):
- RushSolo, RushDouble, RushQuad                            Rush (Solos), Rush (Doubles), Rush (Quads)
- PlanetsSolo, PlanetsDouble, PlanetsQuad, PlanetsPush      Core Wars (Solos), Core Wars (Doubles), Core Wars (Quads), Core Wars Push
- ChronosSolo, ChronosDouble. ChronosMega                   Chronos (Solos), Chronos (Doubles), Chronos (Mega)
- FillTheGapsSolo, FillTheGapsDouble, FillTheGapsQuad       Fill the Gaps (Solos), Fill the Gaps (Doubles), Fill the Gaps (Quads)
- PropHunt                                                  Prop Hunt
- HyperRacersSingle                                         Hyper Racers
- Playground                                                Playground
- Parkour<Lobby/Build/Play>                                 Parkour Builders (Lobby), Parkour Builders (Building), Parkour Builders (Playing)
- AlienBlast                                                Alien Blast
- Spooky                                                    The Entity
- Farming                                                   My Farm Life
*/

let formatMap = new Map([ // make the map for the formatservername option
    ["MainHub", "Main Hub"],

    ["RushSolo", "Rush (Solos)"],
    ["RushDouble", "Rush (Doubles)"],
    ["RushQuad", "Rush (Quads)"],

    ["PlanetsSolo", "Core Wars (Solo)"],
    ["PlanetsDouble", "Core Wars (Doubles)"],
    ["PlanetsQuad", "Core Wars (Quads)"],
    ["PlanetsPush", "Core Wars Push"],

    ["ChronosSolo", "Chronos (Solo)"],
    ["ChronosDouble", "Chronos (Doubles)"],
    ["ChronosMega", "Chronos (Mega)"],

    ["FillTheGapsSolo", "Fill the Gaps (Solos)"],
    ["FillTheGapsDouble", "Fill the Gaps (Doubles)"],
    ["FillTheGapsQuad", "Fill the Gaps (Quads)"],

    ["PropHunt", "Prop Hunt"],
    ["HyperRacersSingle", "Hyper Racers"],
    
    ["Playground", "Playground"],
    ["AlienBlast", "Alien Blast"],
    ["Spooky", "The Entity"],
    ["Farming", "My Farm Life"],

    ["ParkourLobby", "Parkour Builders (Lobby)"],
    ["ParkourBuild", "Parkour Builders (Building)"],
    ["ParkourPlay", "Parkour Builders (Playing)"]
]);

// Initialize storage strings
let serverUUID: string = "Unknown", // internal identifier
    podName: string = "Unknown", // internal identifier
    serverName: string = "Unknown", // name of lobby (game name)
    commitID: string = "Unknown", // internal identifier (latest update?)
    shulkerID: string = "Unknown", // internal identifier
    region: string = "Unknown", // region of lobby
    privacy: string = "Unknown", // public game/private game
    parkourUUID: string = "Unknown"; // parkour id

// Cache whether /whereami was sent automatically
let whereAmISent: boolean = false;

function runWhereAmI() {
    if(notOnGalaxite()) return;
    whereAmISent = true;
    setTimeout(() => {
        game.executeCommand("/whereami");
        return 1;
    }, 5000);
}

// the change-dimension event fires twice, this works around it
let changeDimensionBandage = true;

// Send /whereami every time a new server is joined
client.on("change-dimension", e => {
    // runWhereAmI(); // Uncomment this when the bug is fixed

    if(changeDimensionBandage) { // if the dimension changes an odd number of times, the dimension has actually been changed
        runWhereAmI();
        changeDimensionBandage = false;
    }
    else { // even, ghost fire
        changeDimensionBandage = true;
    }
});
client.on("join-game", e => {
    runWhereAmI();
});

// Handle the response
/* Sample response:
    \u00bc\u0020\u00a7cServerUUID: \u00a7a93e0a641-bc66-4e34-b918-e0ff23684997
    \u00a7cPodName: \u00a7amainhub-b-665d8f7bf-kqrjq
    \u00a7cServerName: \u00a7aMainHub
    \u00a7cCommitID: \u00a7a975198ad
    \u00a7cShulkerID: \u00a7afd53c2d3-8ed9-4d2d-a850-3938b1109dc5
    \u00a7cRegion: \u00a7aus
    \u00a7cPrivacy: \u00a7aPublic
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

    if(msg.message.includes("ServerUUID: ") && msg.message.includes("\n")) { // Check for message (users can't send \n)
        let formattedMessage = msg.message.replace("\u00bc\u0020", ""); // cache message
        let entries = formattedMessage.split("\n\u00a7c"); // Split up the response at this substring, in the process splitting by line
        for(let i = 0; i < entries.length; i++) { // For each entry:
            entries[i] = entries[i].split(" \u00a7a")[1]; // Save only the part of the response after the category name
        }

        // serverUUID = entries[0];
        // podName = entries[1];
        // serverName = entries[2];
        // commitID = entries[3];
        // shulkerID = entries[4];
        // region = entries[5];
        // privacy = entries[6];

        [serverUUID, podName, serverName, commitID, shulkerID, region, privacy] = entries; // Store the entries to cache
        parkourUUID = (entries.length > 7) ? entries[6] : ""; // If ParkourUUID was sent, add it; otherwise store an empty string for it (is this needed?)

        if(whereAmISent) {
            whereAmISent = false;
            if(w.optionHideResponse.getValue()) {
                msg.cancel = true;
            }
        }
    }
});

// Cache new line (very important) (i use it a lot here)
const NL = "\n";

// Actually render stuff
w.whereAmIHUD.on("text", () => {
    if(notOnGalaxite()) return("");

    // initialize render variable
    let render = "";

    // consider options and build text
    if(w.optionServerName.getValue())
        render = render.concat(
            w.optionServerNamePrefix.getValue(),
            w.optionFormatServerName.getValue() ? (formatMap.get(serverName) ?? serverName) : serverName, // ?? is "choose the first defined value"
            w.optionServerNameSuffix.getValue(),
            NL
        );
    if(w.optionRegion.getValue())
        render = render.concat(w.optionRegionPrefix.getValue(), (region.toUpperCase()), w.optionRegionSuffix.getValue(), NL); // Uppercase region, as the server sends it lowercase
    if(w.optionPrivacy.getValue())
        render = render.concat(w.optionPrivacyPrefix.getValue(), privacy, w.optionPrivacySuffix.getValue(), NL);
    if(w.optionParkourUUID.getValue()) {
        render = render.concat(
            (parkourUUID != "")
            ? (
                w.optionParkourUUIDPrefix.getValue(), parkourUUID, w.optionParkourUUIDSuffix.getValue(), NL
            ) : ""
        );
    }
    if(w.optionDevFields.getValue()) {
        render = render.concat(
            w.optionServerUUIDPrefix.getValue(), serverUUID, w.optionServerUUIDSuffix.getValue(),
            NL,
            w.optionPodNamePrefix.getValue(), podName, w.optionPodNameSuffix.getValue(),
            NL,
            w.optionCommitIDPrefix.getValue(), commitID, w.optionCommitIDSuffix.getValue(),
            NL,
            w.optionShulkerIDPrefix.getValue(), shulkerID, w.optionShulkerIDSuffix.getValue(),
        );
    }

    // remove possible trailing \n
    render = render.trim();

    // return finalized text
    return render;
});