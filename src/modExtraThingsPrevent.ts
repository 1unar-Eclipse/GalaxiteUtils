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
function prevent(button: number, eventCancel: boolean) {
    // default return cases
    if(notOnGalaxite()) return;
    if(game.getLocalPlayer()?.getSelectedSlot() != 9) return; // are you on slot 9 (i am not finding out the extra things item id)

    // get use button - not cached because it might change mid-game
    let bind = game.getInputBinding("use"); // right label?
    if(bind < 0)
        bind += 100; // fix mouse button oddities

    // actual prevention code
    if(bind != button) return;

    timeCurrent = Date.now(); // get current time
    if(timeCurrent - timePrev <= optionInterval.getValue()) { // if the difference between the times is less than or equal to the interval specified by the player,
        eventCancel = false; // do not cancel the event
    }
    else { // otherwise,
        eventCancel = true; // cancel it
        if(optionNotif.getValue()) {
            client.showNotification("Click again to confirm Extra Things usage");
        }
    }

    timePrev = timeCurrent; // update previous click time
}

// listen for potential inputs
client.on("key-press", e => {
    prevent(e.keyCode, e.cancel)
});
client.on("click", e => {
    prevent(e.button, e.cancel)
});