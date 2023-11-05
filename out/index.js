"use strict";
// if you're reading this and know what you're doing please open a pr to fix my garbage ts
// i learned this language with freecodecamp, miniscule c#/python knowledge, and looking at the script examples lol
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = exports.notOnGalaxite = void 0;
// Main file for non-module settings.
// Initialization
script.name = "GalaxiteUtils";
script.description = "Various Galaxite-related modules";
script.version = "0.0.0";
script.author = "1unar_Eclipse";
let mod = new Module("GalaxiteUtils", "GalaxiteUtils", "Some extra features that aren't really modules", 0 /* KeyCode.None */);
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
    if (scr.scriptName === script.name) {
        client.getModuleManager().deregisterModule(mod);
    }
});
// Initialize debug option
let debug = mod.addBoolSetting("debug", "Debug Mode", "Logs way more, turn this on if there's a bug");
/**
 * Returns `true` if the player is not on Galaxite; `false` if they are.
 */
function notOnGalaxite() {
    // return true if you are on anything BUT galaxite. this way i can just do `if(notOnGalaxite()) return;` on every client.on()
    return (game.getFeaturedServer() != "Galaxite");
}
exports.notOnGalaxite = notOnGalaxite;
/**
 * Logs something to the script logs only if the user has the `debug` option on.
 * @param log The string to log
 */
function debugLog(log) {
    if (debug.getValue() == true) {
        script.log(log);
    }
}
exports.debugLog = debugLog;
// Import other modules
let modAutoGG = require("modAutoGG");
// let modAutoModule = require("modAutoModule")
// let modBossbarUI = require("modBossbarUI");
// let modEntitySpeedrunTimer = require("modEntitySpeedrunTimer");
// let moeExtraThingsPrevent = require("modExtraThingsPrevent");
// let modKitUI = require("modKitUI");
// let modPKBAttempts = require("modPKBAttempts");
// let modTeamUI = require("modTeamUI");
// let modWhereAmIHUD = require("modWhereAmIHUD");
