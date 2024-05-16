// WhereAmAPI: Backend system that automatically sends and interprets /whereami responses, so it doesn't need to be handled module-by-module.

import { notOnGalaxite } from "./exports";
import { optionWhereAmIDelay } from "./modGlobalMessages";

class WhereAmAPI {
    /**
     * Stores the results of the ServerName field.
     */
    public serverName: string = "Unknown";
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
     * Stores the results of the ParkourUUID field. (Will often be empty.)
     */
    public parkourUUID: string = "";

    /**
     * Whether /whereami has been sent this lobby.
     */
    public whereAmISent: boolean = false;

    /**
     * Whether `/whereami` has been received this lobby.
     */
    public whereAmIReceived: boolean = false;

    /**
     * Array of code to run on the next `/whereami` response.
     */
    delayedCode: (() => void)[] = [];

    /**
     * Executes a given block of code the next time the API updates.
     * 
     * If a `/whereami` has already been sent and processed in this instance, the code runs immediately.
     * @param code The code to run on the next response.
     */
    public onNextResponse(code: () => void) {
        if(!this.whereAmIReceived) { // if there hasn't been a response yet this lobby:
            this.runWhereAmI(); // send the command
            this.delayedCode.push(code); // add the code to a block to run later
        } else { // if there has been a response, just run the code now
            code(); // run the code requested
        }
    }

    /**
     * The `change-dimension` event fires twice. This works around it.
     */
    changeDimensionBandage: boolean = false;

    runWhereAmI() {
        setTimeout(() => {
            game.executeCommand("/whereami");
            this.whereAmISent = true;
            this.whereAmIReceived = false;
        }, optionWhereAmIDelay.getValue() * 1000);
    }

    constructor() { // This is not being used as a constructor. I am specifically using this to register events. There is only 1 WhereAmAPI at a time.
        client.on("receive-chat", msg => {
            if(notOnGalaxite()) return;

            if(this.whereAmISent) { // if a whereami is being waited on:
                if(msg.message.includes("ServerUUID: ") && msg.message.includes("\n")) { // Check for message (users can't send \n)
                    let formattedMessage = msg.message.replace("\uE0BC ", ""); // Cache message
                    let entries = formattedMessage.split("\n\xA7c"); // Split up the response at this substring, in the process splitting by line
                    for(let i = 0; i < entries.length; i++) { // For each entry:
                        entries[i] = entries[i].split(" \xA7a")[1]; // Save only the part of the response after the category name
                    }
            
                    // serverUUID = entries[0];
                    // podName = entries[1];
                    // serverName = entries[2];
                    // commitID = entries[3];
                    // shulkerID = entries[4];
                    // region = entries[5];
                    // privacy = entries[6];
            
                    [this.serverUUID, this.podName, this.serverName, this.commitID, this.shulkerID, this.region, this.privacy] = entries; // Store the entries to cache
                    this.parkourUUID = (entries.length > 7) ? entries[7] : ""; // If ParkourUUID was sent, add it; otherwise store an empty string for it

                    msg.cancel = true; // hide the api-provided whereami
                    this.whereAmIReceived = true; // whereami has been received

                    this.delayedCode.forEach(code => { // for each block of code waiting on a whereami:
                        code(); // run the code
                    });
                }
            }
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

/**
 * The WhereAmAPI. Use this as a pseudo-API for finding server information.
 */
export let api = new WhereAmAPI();