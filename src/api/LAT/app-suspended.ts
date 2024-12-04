import { notOnGalaxite } from "../../util/globals/notOnGalaxite";
import { api } from "../GXAPI";

declare module "../Events" {
	interface Events {
		"LAT:app-suspended": LatiteEvent,
	}
}

client.on("app-suspended", (ev) => {
	if(notOnGalaxite) return;

	api.emit("LAT:app-suspended", ev);
}, 1);