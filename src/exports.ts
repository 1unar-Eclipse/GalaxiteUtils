// A few common functions for use across files.
// Put this everywhere:
// import { notOnGalaxite } from "./exports";

/**
* Returns `true` if the player is not on Galaxite; `false` if they are.
*/
export function notOnGalaxite(): boolean {
    // return true if you are on anything BUT galaxite. this way i can just do `if(notOnGalaxite()) return;` on every client.on()
    return (game.getFeaturedServer() != "Galaxite");
}

/**
 * Debug mode
 */
export let debug: boolean = true;

/**
 * Sends a formatted message to chat.
 * @param message The message to use.
 */
export function sendGXUMessage(message: string) {
    clientMessage("\xa78[\xa7tGalaxite\xa7uUtils\xa78]\xa7r ${message}");
}

// module.exports = notOnGalaxite;