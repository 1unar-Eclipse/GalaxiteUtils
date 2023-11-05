"use strict";
// AutoGG: Automatically sends "gg" on game end
Object.defineProperty(exports, "__esModule", { value: true });
/* TO-DO:
- Add the title-gg games
*/
const index_1 = require("index");
// Module setup
let mod = new Module("AutoGG", "Galaxite AutoGG", 'Automatically says "gg" when a game finishes.', 0 /* KeyCode.None */);
client.getModuleManager().registerModule(mod);
let ch = mod.addBoolSetting("ch", "Chronos", "Chronos support");
let ru = mod.addBoolSetting("ru", "Rush", "Rush support");
let hr = mod.addBoolSetting("hr", "Hyper Racers", "Hyper Racers support");
let cw = mod.addBoolSetting("cw", "Core Wars", "Core Wars support");
let ftg = mod.addBoolSetting("ftg", "Fill the Gaps", "Fill the Gaps support");
let ph = mod.addBoolSetting("ph", "Prop Hunt", "Prop Hunt support");
/* Galaxite Game End Messages:
- Prop Hunt: None, titles AND world join needed (this mode's weird)
- Core Wars: None, titles needed
- Fill the Gaps: None, titles needed
- Chronos: "(is/Team are) the Chronos Champion(s)!"
- Hyper Racers: "Race Finished!"
- Rush: "(is/Team are) the Rush Champion(s)"!
No other modes have gg rewards */
// cache regex
let rgxChronos = /(is|(t|T)eam are) (t|T)he Chronos Champion(|s)!/;
let rgxRush = /(is|(t|T)eam are) (t|T)he Rush Champion(|s)!/;
let message;
// Chronos, Rush, and Hyper Racers all use chat
client.on("receive-chat", msg => {
    // account for the escape case
    if ((0, index_1.notOnGalaxite)())
        return;
    // cache message
    message = msg.message;
    // Chronos
    if (ch.getValue() && rgxChronos.test(message)) {
        game.sendChatMessage("gg");
    }
    // Rush
    if (ru.getValue() && rgxRush.test(message)) {
        game.sendChatMessage("gg");
    }
    // Hyper Racers
    if (hr.getValue() && message.includes("Race Finished!")) {
        game.sendChatMessage("gg");
    }
});
// Core Wars, Fill the Gaps, and Prop Hunt all use titles
client.on("title", title => {
    if ((0, index_1.notOnGalaxite)())
        return;
});
// Prop Hunt is immensely scuffed
client.on("join-game", e => {
});
