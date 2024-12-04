import { Events } from "./Events";
import { EventEmitter } from "../lib/EventEmitter";

// Allows the Events type to simply look like `"event-name": SentInterface`
type GXEvents = Record<keyof Events, (param: Events[keyof Events]) => void>;

class GXAPI extends EventEmitter<GXEvents> {
	private _username: string = "";
	public get username(): string {
		return this._username;
	}


	constructor() {
		super();
	}
}

/**
 * A tool for handling information from Galaxite and Latite.
 * 
 * Keep in mind that, when using `api.on()`, lower-level hooks will fire before higher-level hooks.
 */
export const api = new GXAPI();