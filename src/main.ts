// if you're reading this and know what you're doing please open a pr to fix my garbage ts
// i learned this language with freecodecamp, miniscule c#/python knowledge, and looking at the script examples lol

// Main file for non-module settings.

import { notOnGalaxite } from "./exports";

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
    clientMessage("GalaxiteUtils enabled!");
});
mod.on("disable", () => {
    client.showNotification("GalaxiteUtils disabled!");
    clientMessage("GalaxiteUtils disabled!");
});

// Import other modules
// let modAutoGG = require("modAutoGG");
// let modAutoModule = require("modAutoModule")
// let modBossbarUI = require("modBossbarUI");
// let modEntitySpeedrunTimer = require("modEntitySpeedrunTimer");
let modExtraThingsPrevent = require("modExtraThingsPrevent");
// let modKitUI = require("modKitUI");
// let modPKBAttempts = require("modPKBAttempts");
// let modTeamUI = require("modTeamUI");
let modWhereAmIHUD = require("modWhereAmIHUD");