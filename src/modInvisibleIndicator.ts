// Invisible Indicator: Moves the Invisible status to a HUD element instead of a chat message

import { notOnGalaxite } from "./exports";

let invisibleIndicator = new HudModule(
    "invisibleIndicator",
    "Invisible Indicator",
    "Moves the invisible chat messages in hubs to a UI element",
    KeyCode.None,
    true
);
let optionHideInvisible = invisibleIndicator.addBoolSetting(
    "hideInvisible",
    "Hide Invisible Messages",
    "Hides messages indicating your invisiblity state",
    true
);
client.getModuleManager().registerModule(invisibleIndicator);

// store invisible bool
let invisible: boolean = false;

// hook
client.on("receive-chat", msg => {
    if(notOnGalaxite()) return;

    // cache message for ease of reference
    let message = msg.message;

    if(message.startsWith("\u00ba\u0020You are now")) { // check for invisible status message
        invisible = message.includes("invisible"); // sync the plugin's invisibility status to whether the message contains it
        if(optionHideInvisible.getValue())
            msg.cancel = true;
    }
});

// render text
invisibleIndicator.on("text", () => {
    if(notOnGalaxite() || !invisibleIndicator.isEnabled())
        return "";

    switch(invisible) {
        case true:
            return "Invisible";
        default:
        case false:
            return "";
    }
});