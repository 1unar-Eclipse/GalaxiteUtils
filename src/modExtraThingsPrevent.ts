// Extra Things Prevent: Makes you need to click twice to use Extra Things.

import { notOnGalaxite } from "./exports";

// initialization
let extraThingsPrevent = new Module(
    "etprevent",
    "Accidental Extra Things Prevent",
    "Adds a confirmation click before using Extra Things",
    KeyCode.None
);
client.getModuleManager().registerModule(extraThingsPrevent);

client.on("unload-script", scr => {
    if(scr.scriptName === "GalaxiteUtils") {
        client.getModuleManager().deregisterModule(extraThingsPrevent);
    }
});

// initialize settings
let optionInterval = extraThingsPrevent.addNumberSetting(
    "interval",
    "Max Interval (ms)",
    "Maximum amount of time between uses",
    0,
    1000,
    50,
    500
);
let optionNotif = extraThingsPrevent.addBoolSetting(
    "notif",
    "Show Notification",
    "Shows a notification when Extra Things use was successfully blocked",
    true
);

// the actual function
let timePrev: number = 0; // the first click will always be cancelled, might as well make it all use the same code
let timeCurrent: number;
function prevent(button: number): boolean {
    // default return cases
    if(notOnGalaxite()) return false; // are you on galaxite
    if(!game.getLocalPlayer()) return false; // are you in a game
    if(game.getLocalPlayer()!.getSelectedSlot() != 9) return false; // are you on slot 9 (i am not finding out the extra things item id)

    // get use button - not cached because it might change mid-game
    let bind = game.getInputBinding("use"); // right label?
    if(bind < 0)
        bind += 100; // fix mouse button oddities

    // actual prevention code
    if(bind != button) return false;

    timeCurrent = Date.now(); // get current time
    if(timeCurrent - timePrev <= optionInterval.getValue()) { // if the difference between the times is less than or equal to the interval specified by the player,
        timePrev = timeCurrent; // update previous click time
        return false; // do not cancel the event
    }
    else { // otherwise,
        timePrev = timeCurrent; // update previous click time
        if(optionNotif.getValue()) {
            client.showNotification("Click again to confirm using Extra Things");
        }
        return true; // cancel it
    }
}

// listen for potential inputs
client.on("key-press", e => {
    e.cancel = prevent(e.keyCode);
});
client.on("click", e => {
    e.cancel = prevent(e.button);
});