// Kit UI: Shows your selected perk (Chronos), engine (Hyper Racers), or kit (Kit PvP). Can also show active perks (Core Wars), loot modifiers (Rush), and perks (Alien Blast).

/*
Chronos: Icon + perk name
Chronos (Advanced): Icon + advanced thing
Rush: Lines for each in-game loot mod, icon + count
Hyper Racers: Engine + track name
Kit PvP: Icon + kit name
*/

import { notOnGalaxite, chronosPerkMap } from "./exports";

/* Cues:
- Chronos: 
- Chronos (Random Perk): 
- Hyper Racers: \uE0BD \xA7a\xA7lEngine Equipped - \xA7r\xA7lEngine Name:
- Kit PvP: \uE0BD \xA7a(icon) Name\xA7f kit selected!

- Core Wars (dynamic!):
- Rush (long): 
- Alien Blast (dynamic!)
*/