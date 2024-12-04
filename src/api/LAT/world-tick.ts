import { notOnGalaxite } from "../../util/globals/notOnGalaxite";
import { api } from "../GXAPI";

declare module "../Events" {
	interface Events {
		"LAT:world-tick": LatiteEvent,
	}
}

client.on("world-tick", (ev) => {
	if(notOnGalaxite) return;

	api.emit("LAT:world-tick", ev);
}, 1);