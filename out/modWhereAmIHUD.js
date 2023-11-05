"use strict";
// WhereAmIHUD: Allows showing various details from the /whereami command, like game or region.
// Dependencies: server join event
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("index");
// Initialization
let mod = new HudModule("WhereAmIHUD", "WhereAmIHUD", "Automatically runs /whereami on every server join, and shows selected details", 0 /* KeyCode.None */, true);
client.getModuleManager().registerModule(mod);
// Settings
let serverName = mod.addBoolSetting("ServerName", "GameName", "Show the ServerName (game name) field");
let region = mod.addBoolSetting("Region", "Region", "Show the Region field");
let privacy = mod.addBoolSetting("Privacy", "Privacy", "Show the Privacy (public/private game) field");
let hideResponse = mod.addBoolSetting("HideResponse", "Hide Response", "Runs the command in the background without a chat message (might break standard command uses)");
// Declare a variable for cross-event communication
let whereAmISent = false;
// Send /whereami every time a server is joined
client.on("join-game", e => {
    if ((0, index_1.notOnGalaxite)())
        return;
    game.executeCommand("/whereami");
    whereAmISent = true;
});
// If the command was sent, get the response
client.on("receive-chat", msg => {
    if ((0, index_1.notOnGalaxite)() || !whereAmISent)
        return;
    game.executeCommand("/a");
});
