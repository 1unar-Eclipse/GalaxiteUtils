// Extra Things Prevent: Makes you need to click twice to use Extra Things.
// TO-DO: Add a cooldown to the notification

import { notOnGalaxite, sendGXUMessage } from "./exports";
import { api, GameName } from "./WhereAmAPI";

// initialization
let confirmClick = new Module(
    "etprevent",
    "GXU: Confirm Item Use",
    "Adds options to confirm using Extra Things and interact with shops",
    KeyCode.None
);
let optionInterval = confirmClick.addNumberSetting(
    "interval",
    "Max Interval",
    "Maximum amount of time between a click and the confirmation click",
    0,
    1,
    0.01,
    0.5
);
let optionExtraThings = confirmClick.addBoolSetting(
    "etconfirm",
    "Confirm Extra Things",
    "Require a confirmation click to use Extra Things or leave Kit PVP",
    true
);
let optionShop = confirmClick.addBoolSetting(
    "shopconfirm",
    "Confirm Shop Interaction (experimental)",
    "Require a confirmation click to interact with shops while holding fighting items in Chronos and Core Wars",
    false
);
let optionNotif = confirmClick.addBoolSetting(
    "notif",
    "Show Notification",
    "Shows a notification whenever confirmation is needed",
    true
);
client.getModuleManager().registerModule(confirmClick);

// the actual function
let etTimePrev: number = 0; // the first click will always be cancelled, might as well make it all use the same code
let etTimeCurrent: number;
let shopTimePrev: number = 0;
let shopTimeCurrent: number;
function prevent(button: number, down: boolean): boolean {
    // return cases
    if(notOnGalaxite()) return false; // are you on galaxite
    if(!confirmClick.isEnabled()) return false; // is the module enabled
    if(!down) return false; // is the button pressed
    if(game.isInUI()) return false; // this may have issues. if necessary use game.getScreen()

    let localPlayer = game.getLocalPlayer(); // cache local player, as this is all within a frame and changes will be negligible
    if(!localPlayer) return false;
    
    let bind = game.getInputBinding("use"); // get use button - not cached because it might change mid-game
    if(bind < 0)
        bind += 100; // fix mouse button oddities
    if(bind != button) return false; // is the pressed button the use button

    // actual prevention code
    extraThings:
    if(optionExtraThings.getValue()) {
        if(localPlayer.getSelectedSlot() != 8) break extraThings; // are you on slot 9 (zero-indexed)
        
        etTimeCurrent = Date.now(); // get current time
        if(etTimeCurrent - etTimePrev <= optionInterval.getValue() * 1000) { // if the difference between the times is less than or equal to the interval specified by the player,
            etTimePrev = etTimeCurrent; // update previous click time
            break extraThings; // do not cancel the event
        }
        else { // otherwise,
            etTimePrev = etTimeCurrent; // update previous click time
            communicateBlock(BlockReason.EXTRA_THINGS);
            return true; // cancel it
        }
    }
    shop:
    if(optionShop.getValue()) {
        if(localPlayer.getLookingAt() != LookingAt.Entity) break shop; // are you looking at an entity (either shop or player)
        if(!(api.game == GameName.CHRONOS || api.game == GameName.CORE_WARS)) break shop; // are you in a game with a shop

        if(interactableItems.includes(localPlayer.getHoldingItem().item?.name ?? "fist")) { // if player IS holding a whitelisted item, do not prevent
            sendGXUMessage("Holding a whitelisted item!");
            break shop;
        }
        else { // prevent code
            shopTimeCurrent = Date.now();
            if(shopTimeCurrent - shopTimePrev <= optionInterval.getValue() * 1000) {
                sendGXUMessage("Not prevented!");
                shopTimePrev = shopTimeCurrent;
                break shop;
            }
            else {
                shopTimePrev = shopTimeCurrent;
                communicateBlock(BlockReason.SHOP);
                return true;
            }
        }
    }

    return false; // just in case the module is enabled but neither of the options are
}

// listen for potential inputs
client.on("key-press", e => {
    e.cancel = prevent(e.keyCode, e.isDown);
});
client.on("click", e => {
    e.cancel = prevent(e.button, e.isDown);
});

/*
- snowballs
- bows
- ender pearls
- feathers (feather jumps/falcon feathers)
- slime balls (warper chronos perk)
- paper (bounty contract)
- totems (time capsules)
*/
/**
 * Relevant items that are used with the Use/Interact keybind. These only consider games with shops
 */
const interactableItems: string[] = [
    "fist",
    "minecraft:snowball",
    "minecraft:bow",
    "minecraft:ender_pearl",
    "minecraft:feather", // falcon feather and feather jump
    "minecraft:slime_ball", // warper perk
    "minecraft:paper", // bounty contract
    "minecraft:totem_of_undying", // time capsule
    "galaxite:pickup_backpack", // backpack upgrade
    "galaxite:token_life",
    "galaxite:token_shield",
    "galaxite:smoke_bomb",
    "galaxite:icon_tnt_bomb",
    "galaxite:icon_sonic_snowballs", // this is plural internally
];

function communicateBlock(reason: BlockReason) {
    game.playSoundUI("item.shield.block", 0.25, 0.8); // play a sound effect to indicate the block
    if(optionNotif.getValue()) { // show a notif if wanted
        switch(reason) {
            case BlockReason.EXTRA_THINGS: {
                sendGXUMessage("Click again to confirm using Extra Things");
                break;
            }
            case BlockReason.SHOP: {
                sendGXUMessage("Click again to open the shop");
                break;
            }
        }
    }
}

enum BlockReason {
    EXTRA_THINGS,
    SHOP
}