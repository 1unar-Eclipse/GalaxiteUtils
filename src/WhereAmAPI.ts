// WhereAmAPI: Backend system that automatically sends and interprets /whereami responses, so it doesn't need to be handled module-by-module.

import { EventEmitter } from "./EventEmitter";
import { notOnGalaxite, optionWhereAmIDelay, optionHideResponses, sendGXUMessage } from "./exports";

export enum GameName {
    UNKNOWN = -1,
    MAIN_HUB,
    FILL_THE_GAPS,
    CORE_WARS,
    PROP_HUNT,
    CHRONOS,
    HYPER_RACERS,
    RUSH,
    PLAYGROUND,
    PARKOUR_HUB,
    PARKOUR_BUILD,
    PARKOUR_PLAY,
    THE_ENITTY,
    MY_FARM_LIFE,
    ALIEN_BLAST
}

/**
 * Keys for relevant events that will be emitted.
 */
type GalaxiteEvents = {
    "whereami-update": () => void,
    // "game-start": (game: GameName) => void, // future
    // "game-end": (game: GameName) => void // future
}

class WhereAmAPI extends EventEmitter<GalaxiteEvents> {
    /**
     * For accuracy in sending bug reports, this doesn't actually store the results of the Username field.
     */
    public username: string = "Unknown";
    /**
     * Stores the results of the ServerName field.
     */
    public serverName: string = "Unknown";
    /**
     * Stores the ServerName field in enum form. Notably ignores team sizes.
     */
    public game: GameName = GameName.UNKNOWN;
    /**
     * Stores the results of the Region field. (Will likely be either "us" or "eu".)
     */
    public region: string = "Unknown";
    /**
     * Stores the results of the Privacy field. (Will likely either be "Public" or "Private".)
     */
    public privacy: string = "Unknown";
    /**
     * Stores the results of the ServerUUID field.
     */
    public serverUUID: string = "Unknown";
    /**
     * Stores the results of the PodName field.
     */
    public podName: string = "Unknown";
    /**
     * Stores the results of the CommitID field.
     */
    public commitID: string = "Unknown";
    /**
     * Stores the results of the ShulkerID field.
     */
    public shulkerID: string = "Unknown";
    /**
     * Stores the results of the ParkourUUID field. (Will often be null.)
     */
    public parkourUUID: string | null = null;

    /**
     * Whether /whereami has been sent this lobby.
     */
    public whereAmISent: boolean = false;

    /**
     * Whether `/whereami` has been received this lobby.
     */
    public whereAmIReceived: boolean = false;

    /**
     * The `change-dimension` event fires twice. This works around it.
     */
    private changeDimensionBandage: boolean = false;

    private runWhereAmI() {
        if(notOnGalaxite()) return;
        setTimeout(() => {
            game.executeCommand("/whereami");
            this.whereAmISent = true;
            this.whereAmIReceived = false;
        }, optionWhereAmIDelay.getValue() * 1000);
    }

    private response: any

    /**
     * Reads a given field of the last /whereami response and returns the result.
     * @param field The field to read.
     * @returns Usually a string with the correct interpretation. Will only return `null` in case there is no ParkourUUID.
     */
    private assign(field: string): any {
        let def: string | null; // default is reserved
        if(field == "ParkourUUID") 
            def = null;
        else
            def = "Unknown";
        return (this.response[field] ?? def);
    }

    private parseWhereAmI(message: string): boolean {
        let cancel: boolean = false;

        if(message.includes("ServerUUID:") && message.includes("\n")) { // Check for message (users can't send \n)
            let formattedMessage = message.replace("\uE0BC \xA7c", ""); // Cache message
            let entries = formattedMessage.split("\n\xA7c") ?? ""; // Split up the response at this substring, in the process splitting by line and removing color
            let whereAmIPairs: string[][] = [];
            for(let i = 0; i < entries.length; i++) { // For each entry:
                whereAmIPairs[i] = entries[i].split(": \xA7a"); // Save the key and its corresponding value, in the process removing color
            }
            /* The general structure of whereAmIPairs is:
            [
                ["Username" : username],
                ["ServerUUID" : serverUUID],
                ...
                ["FieldName" : fieldResult]
            ]
            */
            this.response = whereAmIPairs.reduce((prevVal, [key, value]) => {
                prevVal[key] = value;
                return prevVal;
            }, {} as any);
            /* Response should now look like:
            {
                "Username" : username,
                "ServerUUID" : serverUUID,
                ...
                "FieldName" : fieldResult
            }
            */

            // Store entries
            this.username = game.getLocalPlayer()!.getName(); // this is being ran on a receive-chat event. there will be a player
            this.serverUUID = this.assign("ServerUUID");
            this.podName = this.assign("PodName");
            this.serverName = this.assign("ServerName");
            this.commitID = this.assign("CommitID");
            this.shulkerID = this.assign("ShulkerID");
            this.region = this.assign("Region");
            this.privacy = this.assign("Privacy");
            this.parkourUUID = this.assign("ParkourUUID"); // The assign function already considers the possibility of no entry

            this.game = nameToGame.get(this.serverName) ?? GameName.UNKNOWN; // Assign the shorter game name field
            
            if(this.whereAmISent && optionHideResponses.getValue())
                cancel = true;

            this.whereAmISent = false;
            this.whereAmIReceived = true; // whereami has been received

            this.emit("whereami-update");
        }

        return cancel;
    }

    constructor() { // Registers the events for this WhereAmAPI.
        super();
        client.on("receive-chat", msg => {
            if(notOnGalaxite()) return;

            msg.cancel = this.parseWhereAmI(msg.message);
        });

        // Send /whereami every time a new server is joined
        client.on("change-dimension", e => {
            if(this.changeDimensionBandage) { // if the dimension changes an odd number of times, the dimension has actually been changed
                this.runWhereAmI();
                this.changeDimensionBandage = false;
            }
            else { // even, ghost fire
                this.changeDimensionBandage = true;
            }
        });
        client.on("join-game", e => {
            this.runWhereAmI();
        });
    }
}

const nameToGame = new Map([
    ["MainHub", GameName.MAIN_HUB],

    ["RushSolo", GameName.RUSH],
    ["RushDouble", GameName.RUSH],
    ["RushQuad", GameName.RUSH],

    ["PlanetsSolo", GameName.CORE_WARS],
    ["PlanetsDouble", GameName.CORE_WARS],
    ["PlanetsQuad", GameName.CORE_WARS],
    ["PlanetsPush", GameName.CORE_WARS],

    ["ChronosSolo", GameName.CHRONOS],
    ["ChronosDouble", GameName.CHRONOS],
    ["ChronosMega", GameName.CHRONOS],

    ["FillTheGapsSolo", GameName.FILL_THE_GAPS],
    ["FillTheGapsDouble", GameName.FILL_THE_GAPS],
    ["FillTheGapsQuad", GameName.FILL_THE_GAPS],

    ["PropHunt", GameName.PROP_HUNT],
    ["HyperRacersSingle", GameName.HYPER_RACERS],
    
    ["Playground", GameName.PLAYGROUND],
    ["AlienBlast", GameName.ALIEN_BLAST],
    ["Spooky", GameName.THE_ENITTY],
    ["Farming", GameName.MY_FARM_LIFE],

    ["ParkourLobby", GameName.PARKOUR_HUB],
    ["ParkourBuild", GameName.PARKOUR_BUILD],
    ["ParkourPlay", GameName.PARKOUR_PLAY]
]);

/**
 * The WhereAmAPI. Use this as a pseudo-API for finding server information.
 */
export let api = new WhereAmAPI();