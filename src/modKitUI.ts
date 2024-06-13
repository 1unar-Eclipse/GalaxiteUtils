// Perk UI: Shows your selected perk (Chronos), engine (Hyper Racers), or kit (Kit PvP). Can also show active perks (Core Wars), loot modifiers (Rush), and perks (Alien Blast).

/*
Chronos: Icon + perk name
Chronos (Advanced): Icon + advanced thing
Rush: Lines for each in-game loot mod, icon + count
Hyper Racers: Engine + track name
Kit PvP: Icon + kit name

Cues:
- Chronos: \uE0BD \xA7a\xA7lPerk Equipped - \xA7r\xA7lName:
- Chronos (Random Perk): \uE0BD \xA7a\xA7lRandom Perk Equipped - \xA7r\xA7lName:
- Hyper Racers: \uE0BD \xA7a\xA7lEngine Equipped - \xA7r\xA7lName:
- Kit PvP: \uE0BD \xA7a(icon) Name\xA7f kit selected!

- Core Wars (dynamic!):
- Rush (long): 
- Alien Blast (dynamic!)
*/

import { notOnGalaxite, sendGXUMessage } from "./exports";
import { api, GameName } from "./WhereAmAPI";

let perkUI = new TextModule(
    "perkui",
    "GXU: Perk UI",
    "Shows your equipped perk in various games.",
    KeyCode.None
);
let optionChronos = perkUI.addBoolSetting(
    "chronos",
    "Chronos Perk",
    "Shows the equipped perk in games of Chronos.",
    true
);
let optionChronosIcon = perkUI.addBoolSetting(
    "chronosicon",
    "Chronos Perk Icon",
    "Adds icons to represent each Chronos perk.\n\nForces Minecraft renderer to be on.",
    true
);
optionChronosIcon.setCondition("chronos");
let optionHyperRacers = perkUI.addBoolSetting(
    "hyperracers",
    "Hyper Racers Engine",
    "Shows the equipped engine in games of Hyper Racers.",
    true
);
let optionKitPVP = perkUI.addBoolSetting(
    "kitpvp",
    "Kit PVP Kit",
    "Shows the equipped kit in games of Kit PVP.",
    true
);
let optionKitPVPIcon = perkUI.addBoolSetting(
    "kitpvpicon",
    "Kit PVP Icon",
    "Use the icons that represent each kit. (Unlike Chronos, whether you selected a random kit will not be shown.)\n\nForces Minecraft renderer to be on.",
    true
);
optionKitPVPIcon.setCondition("kitpvp");
client.getModuleManager().registerModule(perkUI);

let perk: string = "";
let perkIcon: string = "";
let random: boolean = false;
const rgxChronosPerk = /(?:\uE0BD \xA7a\xA7l(?:Random |)Perk Equipped - \xA7r\xA7l)([^:]+)/; // i can just check for "random" in the message as well
const rgxHyperRacersEngine = /(?:\uE0BD \xA7a\xA7lEngine Equipped - \xA7r\xA7l)([^:]+)/;
const rgxKitPVPKit = /(?:\uE0BD \xA7a)(.)([^ ]+)/; // match 0 is the icon, 1 is the kit. there is always a space after the kit name, and they are never 2 words

client.on("receive-chat", m => {
    if(notOnGalaxite()) return;
    if(!perkUI.isEnabled()) return;
    if(!(api.game == GameName.CHRONOS || api.game == GameName.HYPER_RACERS || api.game == GameName.PLAYGROUND)) { // only do stuff in ch, hr, or pg
        perk = "";
        perkIcon = "";
        random = false;
        return;
    }

    const matchCH = rgxChronosPerk.exec(m.message);
    const matchHR = rgxHyperRacersEngine.exec(m.message);
    const matchKitPVP = rgxKitPVPKit.exec(m.message); // [icon, kit]
    if(matchCH && api.game == GameName.CHRONOS) { // find chronos perk
        sendGXUMessage(matchCH);
        perk = matchCH[0]; // only 1 match possible
        perkIcon = chronosPerkMap.get(perk) ?? "";
        random = m.message.includes("Random");
    }
    else if(matchHR && api.game == GameName.HYPER_RACERS) { // find hyper racers engine
        sendGXUMessage(matchHR);
        perk = matchHR[0];
        perkIcon = "";
        random = false;
    }
    else if(matchKitPVP && api.game == GameName.PLAYGROUND) { // find kit pvp kit
        sendGXUMessage(matchKitPVP);
        perk = matchKitPVP[1];
        perkIcon = matchKitPVP[0];
        random = false; // random is impossible to know in kits
    }
    else sendGXUMessage("No match!");

    const rgxPlaygroundExitMessage = new RegExp(`\uE0AA (${
            game.getLocalPlayer()!.getName()
        }|${
            client.getModuleManager().getModuleByName("Nickname")?.getSettings()[2].getValue()
        })`
    );
    if(rgxPlaygroundExitMessage.test(m.message) || m.message.startsWith("\uE0BD \xA7c")) {// remove kit pvp kit
        sendGXUMessage("Kit PVP exit message!")
        perk = "";
        perkIcon = "";
        random = false;
    }
    else sendGXUMessage("Not a Kit PVP exit message!");
});

client.on("change-dimension", e => { // reset perk on dimension change
    perk = "";
    perkIcon = "";
    random = false;
});

perkUI.on("text", () => {
    if(notOnGalaxite() || !perkUI.isEnabled()) return "";

    // let optionMinecraftRenderer = modPerkUI.getSettings().find((s) => {
    //     return (s.name == "forceMinecraftRend");
    // });
    // if(optionChronosIcon.getValue() || optionKitPVPIcon.getValue())
    //     optionMinecraftRenderer.setValue(true);

    switch(api.game) {
        case GameName.CHRONOS: {
            if(!optionChronos.getValue()) return "";
            return ((`${random ? "\uE1EB" : ""} ${optionChronosIcon.getValue() ? perkIcon : ""} ${perk}`).trim()); // random symbol if random, icon if enabled, perk name
        }
        case GameName.HYPER_RACERS: {
            if(!optionHyperRacers.getValue()) return "";
            return perk;
        }
        case GameName.PLAYGROUND: {
            if(!optionKitPVP.getValue()) return "";
            return ((`${optionKitPVPIcon.getValue() ? perkIcon : ""} ${perk}`).trim());
        }
        default: {
            return "";
        }
    }
});

// Cache the minecraft renderer setting

// client.on("join-game", e => {

// });

// function forceMinecraftRendererOn() { // Force Minecraft renderer on, allowing emotes to be used
//     optionMinecraftRenderer.setValue(true);
// }

/**
 * random is `\uE1EB`
 */
const chronosPerkMap = new Map([
    ["", ""],
    // OFFENSE
    ["Bow Start", "\uE115"], // tier 3 bow
    ["Prepare Shot", "\uE1C0"], // battery
    ["Sonic Snowballs", "\uE1C4"], // sonic snowball
    ["Daredevil", "\uE184"], // faded dark red player
    ["Solid Snowballs", "\uE119"], // snowball
    ["Glass Cannon", "\uE12B"], // playground glass cannon graphic
    ["Sniper", "\uE14D"], // playground sniper graphic
    ["Airstrike", "\uE12D"], // firework rocket
    ["Sword Specialist", "\uE112"], // netherite sword
    ["Assassin", "\uE1A2"], // playground assassin graphic
    ["Revenger", "\uE136"], // red skull
    ["Fireballs", "\uE11A"], // fire death icon
    ["Poison Arrows", "\uE114"], // tier 2 bow
    ["Bandit Boss", "\uE103"], // that code guy
    ["Levitation Arrows", "\uE11B"], // broken bone
    ["Time Siphon", "\uE138"], // hourglass

    // DEFENSE
    ["Tank", "\uE101"], // classic armor icon
    ["Health Scavenger", "\uE1A5"], // health pop-in
    ["Medicine", "\uE201"], // apple
    ["Blinding Forcefield", "\uE1A0"], // blindness icon
    ["Weakening Arrows", "\uE113"], // gray bow
    ["Vampire", "\uE10B"], // playground vampire icon
    ["Heavy Duty", "\uE12F"], // still anvil
    ["Hunker Down", "\uE247"], // statue
    ["Armour Specialist", "\uE10A"], // netherite armor
    ["Smoke Bomb", "\uE1A7"], // mirror / empty window
    ["Soul Collector", "\uE14B"], // soul
    ["Ancient", "\uE1D2"], // silver clock
    ["Shielder", "\uE1A8"], // shield
    ["Shattered Glass", "\uE129"], // cactus death icon
    ["Scaredy Cat", "\uE1DF"], // engine
    ["Trapper", "\uE12A"], // explosion death icon

    // UTILITY
    ["Mobility", "\uE19A"], // kart
    ["Backpack", "\uE1C2"], // open lock
    ["Builder", "\uE147"], // block
    ["Falcon", "\uE14F"], // feather
    ["Vault Raider", "\uE1C1"], // lock
    ["Scout", "\uE1A4"], // speed icon
    ["Sticky Arrows", "\uE1A3"], // snail
    ["Stealth Jet", "\uE1AC"], // particles
    ["Time Hoarder", "\uE139"], // gold clock
    ["Ninja", "\uE190"], // person
    ["Gravity Spheres", "\uE11C"], // bubbles
    ["Dasher", "\uE12C"], // trident
    ["Sparrow", "\uE193"], // dropship icon
    ["Soulbound", "\uE1A1"], // blue death icon
    ["Ghost", "\uE1AB"], // ghost nameplate icon
    ["Recon", "\uE1F7"], // red exclamation mark
    ["Lucky", "\uE1EC"], // present

    // BOUNTY - bounty char is \uE148
    ["Feedback Loop", "\uE148\uE19C"], // add player
    ["Contract of Blessing", "\uE148\uE1BD"], // gold plus
    ["Contract of Protection", "\uE148\uE10C"], // absorption heart
    ["Contract of Rewarding", "\uE148\uE1EC"], // present

    // TEAM - general team icon is \uE146
    ["Warper", "\uE146\uE14E"], // ender pearl
    ["Frontline", "\uE146\uE111"], // diamond sword
    ["Healer", "\uE146\uE10B"], // red heart
    ["Avenger", "\uE146\uE136"], // red skull
    ["Mayday", "\uE146\uE1A4"], // speed icon
    ["Freezer", "\uE146\uE1C5"], // ice slider
]);