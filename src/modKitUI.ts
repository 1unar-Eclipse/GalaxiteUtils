// Perk UI: Shows your selected perk (Chronos), engine (Hyper Racers), or kit (Kit PvP). Can also show active perks (Core Wars), loot modifiers (Rush), and perks (Alien Blast).

/*
Chronos: Icon + perk name
Chronos (Advanced): Icon + advanced thing
Rush: Lines for each in-game loot mod, icon + count
Hyper Racers: Engine + track name
Kit PvP: Icon + kit name
*/

import { notOnGalaxite, chronosPerkMap } from "./exports";
import { api, GameName } from "./WhereAmAPI";

/* Cues:
- Chronos: \uE0BD \xA7a\xA7lPerk Equipped - \xA7r\xA7lName:
- Chronos (Random Perk): \uE0BD \xA7a\xA7lRandom Perk Equipped - \xA7r\xA7lName:
- Hyper Racers: \uE0BD \xA7a\xA7lEngine Equipped - \xA7r\xA7lName:
- Kit PvP: \uE0BD \xA7a(icon) Name\xA7f kit selected!

- Core Wars (dynamic!):
- Rush (long): 
- Alien Blast (dynamic!)
*/

let modPerkUI = new TextModule(
    "perkui",
    "GXU: Perk UI",
    "Shows your equipped perk in various games",
    KeyCode.None
);
let optionChronos = modPerkUI.addBoolSetting(
    "chronos",
    "Chronos Perk",
    "Shows the equipped perk in games of Chronos.",
    true
);
let optionChronosIcon = modPerkUI.addBoolSetting(
    "chronosicon",
    "Chronos Perk Icon",
    "Adds icons to represent each Chronos perk.\n\nForces Minecraft renderer to be on.",
    true
);
optionChronosIcon.setCondition("chronos");
let optionHyperRacers = modPerkUI.addBoolSetting(
    "hyperracers",
    "Hyper Racers Engine",
    "Shows the equipped engine in games of Hyper Racers.",
    true
);
let optionKitPVP = modPerkUI.addBoolSetting(
    "kitpvp",
    "Kit PVP Kit",
    "Shows the equipped kit in games of Kit PVP.",
    true
);
let optionKitPVPIcon = modPerkUI.addBoolSetting(
    "kitpvpicon",
    "Kit PVP Icon",
    "Use the icons that represent each kit. (Unlike Chronos, whether you selected a random kit will not be shown.)\n\nForces Minecraft renderer to be on.",
    true
);
optionKitPVP.setCondition("kitpvp");
client.getModuleManager().registerModule(modPerkUI);

let perk: string;
let perkIcon: string;
let random: boolean;
const rgxChronosPerk = /(?<=\uE0BD \xA7a\xA7l(?<=Random |)Perk Equipped - \xA7r\xA7l)([^:]+)/; // i can just check for "random" in the message as well
const rgxHyperRacersEngine = /(?<=\uE0BD \xA7a\xA7lEngine Equipped - \xA7r\xA7l)([^:]+)/;
const rgxKitPVPKit = /(?<=\uE0BD \xA7a)(.)([^ ]+)/; // match 0 is the icon, 1 is the kit. there is always a space after the kit name, and they are never 2 words

client.on("receive-chat", m => {
    if(notOnGalaxite()) return;
    if(!(api.game == GameName.CHRONOS || api.game == GameName.HYPER_RACERS || api.game == GameName.PLAYGROUND)) { // only do stuff in ch, hr, or pg
        perk = "";
        perkIcon = "";
        return;
    }

    if(rgxChronosPerk.test(m.message) && api.game == GameName.CHRONOS) { // find chronos perk
        let chPerk = m.message.match(rgxChronosPerk)![0];
        perk = chPerk; // only 1 match possible
        perkIcon = chronosPerkMap.get(chPerk) ?? "";
        random = m.message.includes("Random");
    }
    if(rgxHyperRacersEngine.test(m.message) && api.game == GameName.HYPER_RACERS) { // find hyper racers engine
        perk = m.message.match(rgxHyperRacersEngine)![0];
        perkIcon = "";
        random = false;
    }
    if(rgxKitPVPKit.test(m.message) && api.game == GameName.PLAYGROUND) { // find kit pvp kit
        let kit = m.message.match(rgxKitPVPKit)!; // [icon, kit]
        perk = kit[1];
        perkIcon = kit[0];
        random = false; // random is impossible to know in kits
    }

    const rgxPlaygroundExitMessage = new RegExp(`\uE0AA (${
            game.getLocalPlayer()!.getName()
        }|${
        client
            .getModuleManager()
            .getModuleByName("Nickname")
            ?.getSettings()[2]
            .getValue()
        })`
    );
    if(rgxPlaygroundExitMessage.test(m.message) || m.message.startsWith("\uE0BD \xA7c")) {// remove kit pvp kit
        perk = "";
        perkIcon = "";
        random = false;
    }
});

client.on("change-dimension", e => { // reset perk on dimension change
    perk = "";
    perkIcon = "";
    random = false;
})

modPerkUI.on("render", () => {
    if(notOnGalaxite() || !modPerkUI.isEnabled()) return;
    if(optionChronosIcon.getValue() || optionKitPVPIcon.getValue())
        forceMinecraftRendererOn();

    switch(api.game) {
        case GameName.CHRONOS: {
            if(!optionChronos.getValue()) return "";
            return (`${random ? "\uE1EB" : ""} ${optionChronosIcon.getValue() ? perkIcon : ""} ${perk}`.trim()); // random symbol if random, icon if enabled, perk name
        }
        case GameName.HYPER_RACERS: {
            if(!optionHyperRacers.getValue()) return "";
            return perk;
        }
        case GameName.PLAYGROUND: {
            if(!optionKitPVP.getValue()) return "";
            return (`${optionKitPVPIcon.getValue() ? perkIcon : ""} ${perk}`.trim());
        }
        default: {
            return "";
        }
    }
});

let minecraftRenderer = modPerkUI.getSettings().find((s) => {
    return (s.name == "forceMinecraftRend");
})!;

function forceMinecraftRendererOn() { // Force Minecraft renderer on, allowing emotes to be used
    minecraftRenderer.setValue(true);
}