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

module.exports = notOnGalaxite