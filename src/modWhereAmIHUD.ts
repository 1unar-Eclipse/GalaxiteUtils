// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.

import { notOnGalaxite } from "./exports";
import * as w from "./WhereAmIHUDOptions";
import { api } from "./WhereAmAPI";

// Initialization

/* Field list:
- ServerUUID (devFields)
- PodName (devFields)
- ServerName (serverName)
- CommitID (devFields)
- ShulkerID (devFields)
- Region (region)
- Privacy (privacy)

Order: ServerName, Region, Privacy, ParkourUUID, Username, [ServerUUID, PodName, CommitID, ShulkerID]

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

// Cache new line (very important) (i use it a lot here)
const NL = "\n";

// Actually render stuff
w.whereAmIHUD.on("text", () => {
    if(notOnGalaxite()) return("");

    // initialize render variable
    let render = "";

    // consider options and build text
    if(w.optionServerName.getValue()) {
        render = render.concat(
            w.optionServerNamePrefix.getValue(),
            w.optionFormatServerName.getValue() ? (formatMap.get(api.serverName) ?? api.serverName) : api.serverName, // ?? is "choose the first defined value"
            w.optionServerNameSuffix.getValue(),
            NL
        );
    }
    if(w.optionRegion.getValue()) {
        render = render.concat(w.optionRegionPrefix.getValue(), (
            w.optionUseNAName.getValue() && api.region == "us" // if the user wants to see na instead of us and the region actually is us
            ? "na"
            : api.region
        ).toUpperCase(), w.optionRegionSuffix.getValue(), NL); // Uppercase region, as the server sends it lowercase
    }
    if(w.optionPrivacy.getValue())
        render = render.concat(w.optionPrivacyPrefix.getValue(), api.privacy, w.optionPrivacySuffix.getValue(), NL);
    if(w.optionParkourUUID.getValue()) {
        render = render.concat(
            (w.optionParkourUUID.getValue() && api.parkourUUID.trim() != "")
            ? (w.optionParkourUUIDPrefix.getValue() + api.parkourUUID + w.optionParkourUUIDSuffix.getValue() + NL)
            : ""
        );
    }
    if(w.optionUsername.getValue())
        render = render.concat(w.optionUsernamePrefix.getValue(), api.username, w.optionUsernameSuffix.getValue(), NL);
    if(w.optionDevFields.getValue()) {
        render = render.concat(
            w.optionServerUUIDPrefix.getValue(), api.serverUUID, w.optionServerUUIDSuffix.getValue(),
            NL,
            w.optionPodNamePrefix.getValue(), api.podName, w.optionPodNameSuffix.getValue(),
            NL,
            w.optionCommitIDPrefix.getValue(), api.commitID, w.optionCommitIDSuffix.getValue(),
            NL,
            w.optionShulkerIDPrefix.getValue(), api.shulkerID, w.optionShulkerIDSuffix.getValue(),
        );
    }

    // remove possible trailing \n
    render = render.trim();

    // return finalized text
    return render;
});