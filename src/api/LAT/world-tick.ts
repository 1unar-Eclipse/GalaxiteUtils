import { notOnGalaxite } from "../../util/functions/notOnGalaxite";
import { api } from "../GXAPI";

declare module "../Events" {
	interface Events {
		"LAT:world-tick": LatiteEvent,
	}
}

client.on("world-tick", (ev: LatiteEvent): void => {
	if(notOnGalaxite()) return;

	api.emit("LAT:world-tick", ev);
}, 1);