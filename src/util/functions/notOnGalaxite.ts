// Maintains the notOnGalaxite variable

let notOnGalaxiteBool: boolean = false;

client.on("join-game", (ev: LatiteEvent): void => {
	set();
}, 2);
client.on("change-dimension", (ev: LatiteEvent): void => {
	set();
}, 2);
client.on("transfer", (ev: LatiteEvent): void => {
	set();
}, 2);
client.on("leave-game", (ev: LatiteEvent): void => {
	set();
}, 2);

function set(): void {
	notOnGalaxiteBool = (game.getFeaturedServer() !== "Galaxite");
}

export function notOnGalaxite(): boolean {
	return notOnGalaxiteBool;
}

// /**
//  * Checks if the player is not on Galaxite. Should only be used in hooks - if this needs to be in a module, something is very wrong.
//  * @returns False if on Galaxite; True if not on Galaxite. (Use `if(notOnGalaxite()) return;`)
//  */
// export function notOnGalaxite(): boolean {
// 	return !onGalaxite;
// }