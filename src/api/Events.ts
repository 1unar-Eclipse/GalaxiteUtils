/*

This file is intentionally pretty empty. The Events interface is built across every file within this folder.
To add a hook:
1. Add the file. It should be contained in one of the folders with hooks. The name should match the name of the event without the key
  Ex. if defining the LAT:world-tick event, the file should be ./LAT/world-tick.ts
2. In the file, add the generally-necessary imports (api, and notOnGalaxite if defining a LAT hook)
3. Add something in the vein of this code block:
```ts
declare module "../Events" {
	interface Events {
		"KEY:event-name": EventParam,
	}
}
```

There is an order to which events will fire as a consequence of hooks being built on other hooks (top-down):
1. Latite events
2. Global Galaxite events
3. GXU events / Specific game events
4. Multi-game events
(In general, lower-level hooks will fire before higher-level hooks)

*/

// TODO: Global setting to change priority

/**
 * This interface lists every single event and arguments passed to the event.
 */
export interface Events {
	/* First chunk of events */
	// LAT: Base Latite events.
		// These are passed through only if on Galaxite.

	/* Second chunk of events */
	// GAL: Global Galaxite events.
		// Usually things like players' chat messages that can regularly occur no matter where you are.

	/* Third chunk of events */
	// GXU: GalaxiteUtils-emitted events.
		// Usually anything to do with a very specific module.

	// FTG: Fill the Gaps events.
	// CRW: Core Wars events.
	// PRH: Prop Hunt events.
	// CHR: Chronos events.
	// HYP: Hyper Racers events.
	// RSH: Rush events.
	// PLG: Playground events.
	// PKB: Parkour Builders events.
	// FRF: Frost Fight events.
	// ENT: The Entity events.
	// ALB: Alien Blast events.

	/* Fourth chunk of events */
	// ANY: Events that might occur in any/multiple game(s).
		// These might be useful in a few specific situations (such as a generalized game end cue).
}