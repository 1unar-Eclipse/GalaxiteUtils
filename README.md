<h1 align="center">GalaxiteUtils</h1>

# WARNING: THIS IS SUPER WIP
I have very little free time and no JS experience outside of this project and FreeCodeCamp. Any PRs to help are greatly appreciated.

## A Latite plugin that adds a variety of Galaxite-related modules.
Don't want to say gg after every game? Want to show your viewers what perk you're using? Need to know how many times you've died in a Parkour Builders run? This is for you - all of those and more are actual modules!

Module list:
- **AutoGG:** Automatically sends "gg" to the chat whenever a game ends.
- **WhereAmIHUD:** Automatically runs `/whereami` on joining any game, and keeps whatever details you want on screen too!

Future Plans:
- **Auto-Modules:** Allows you to automatically disable certain modules that may conflict with a game.
  - Toggle Sprint in The Entity, and Coordinates in Chronos.
- **Accidental Extra Things Prevent:** Makes you need to double-click to use Extra Things, so you don't accidentally use it in combat and die.
- **The Entity: Speedrun Timer:** Tracks how long a run takes, and in the future, full splits!
- **Kit UI:** Shows what perk, engine, or kit you're using, as well as what loot modifiers are in your Rush game.
- **Parkour Builders: Attempt Counter:** Insert Geometry Dash soundbyte here
- **Mythic Chest Timers:** For Rush and Chronos, automatically know when mythic chests will arrive!
- **Team UI:** Because Galaxite doesn't have this natively for some reason.

## Notes
`/whereami` will be ran a lot, even without the module on. This is since it gives a pretty good amount of information; it's one of the key ways for the plugin to know the game.

## Issues
I'm expecting a lot of desync-related bugs, so please include steps to reproduce anything weird you may find. Otherwise, just be clear.

I'm also cool with suggestions, but don't expect me to implement everything.

## PRs
I'll probably accept PRs for the following fairly quickly:
- Code cleanup
- Bug fixes
- Correcting random inconsistencies
- Fixing my syntax and other issues from lack of experience

I'll take a bit longer with modules, don't want them to be doing anything harmful, but I'm not against them being submitted. If you want to make a new module, in addition to normal Latite module things, make sure to add the following to the start of any file:
```ts
import { notOnGalaxite } from "./exports";
```
as well as add this line of code to any event:
```ts
if(notOnGalaxite()) return;
```
Those will make the remainder of your code only occur on Galaxite. Beyond that, my only criteria is that it works and adds a new, useful feature; I'd especially be happy with modules for games I don't play a lot.

## Building
This uses [the template found here](https://github.com/LatiteScripting/Template) as a base, so it can be compiled with Ctrl-Shift-B in VS Code once cloned. Just make sure to download the Node modules first with `npm i`.

The terminal command `npx tsc -b` in the root folder also works.

I don't know how to GitHub, if something else should be here please open an issue