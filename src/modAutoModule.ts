// Auto-Module: Automatically toggles the state of certain modules in certain games.
// List:
// - The Entity: Toggle Sprint
// - Alien Blast: Toggle Sprint
// - Chronos: Coordinates

import { notOnGalaxite } from "./exports";

let modAutoModule = new Module(
    "automodule",
    "GXU: Auto Module Toggles",
    "Automatically turns off specific modules in certain games",
    KeyCode.None
);
modAutoModule.addBoolSetting(
    "chronos-coordinates",
    "Coordinates (Chronos)",
    "Turns off Coordinates while in Chronos",
    true
);
modAutoModule.addBoolSetting(
    "entity-togglesprint",
    "Toggle Sprint (The Entity)",
    "Turns off Toggle Sprint while in The Entity",
    false
);
modAutoModule.addBoolSetting(
    "alienblast-togglesprint",
    "Toggle Sprint (Alien Blast)",
    "Turns off Toggle Sprint while in Alien Blast",
    false
);
// client.getModuleManager().registerModule(modAutoModule);

