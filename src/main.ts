// if you're reading this and know what you're doing please open a pr to fix my garbage ts
// i learned this language with freecodecamp, miniscule c#/python knowledge, and looking at the script examples lol

// Main file for non-module settings.

let mod = new Module(
    "GalaxiteUtils",
    "GalaxiteUtils",
    "Some extra features that aren't really modules",
    KeyCode.None
);
client.getModuleManager().registerModule(mod);

// Obligatory module stuff
mod.on("enable", () => {
    client.showNotification("GalaxiteUtils enabled!");
    script.log("GalaxiteUtils enabled!");
});
mod.on("disable", () => {
    client.showNotification("GalaxiteUtils disabled!");
    script.log("GalaxiteUtils disabled!");
});
client.on("unload-script", scr => {
    if(scr.scriptName === script.name) {
        client.getModuleManager().deregisterModule(mod);
    }
});

let debugMode = mod.addBoolSetting(
    "debugMode",
    "Debug Mode",
    "Logs some more information"
);

// funny logs
script.log("trans rights");
debugLog("...imply the existence of trans lefts [debug mode on!]")

/**
* Returns `true` if the player is not on Galaxite; `false` if they are.
*/
export function notOnGalaxite(): boolean {
    // return true if you are on anything BUT galaxite. this way i can just do `if(notOnGalaxite()) return;` on every client.on()
    return (game.getFeaturedServer() != "Galaxite");
}

/**
 * Logs something when debug mode is on.
 */
export function debugLog(log: string) {
    if(debugMode.getValue())
        script.log(log);
}

// Import other modules
let modAutoGG = require("modAutoGG");
// let modAutoModule = require("modAutoModule")
// let modBossbarUI = require("modBossbarUI");
// let modEntitySpeedrunTimer = require("modEntitySpeedrunTimer");
// let modKitUI = require("modKitUI");
// let modPKBAttempts = require("modPKBAttempts");
// let modTeamUI = require("modTeamUI");
let modWhereAmIHUD = require("modWhereAmIHUD");