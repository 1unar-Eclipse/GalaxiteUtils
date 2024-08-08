<h1 align="center"><b>GalaxiteUtils</b></h1>
<h2 align="center">A Latite plugin that adds a variety of Galaxite-related modules</h2>

Don't want to say GG after every game? Want to show your viewers what perk you're using? Need to know how many times you've died in a Parkour Builders run? This is for you - all of those and more are actual modules!
***
## Installation
1. Download and install [Latite Client](https://latite.net/)
2. Run Minecraft with the client injected
3. In the chat menu, type `.plugin install GalaxiteUtils` and send the message
***
## Module list
- **AutoGG:** Automatically sends "gg" to the chat whenever a game ends.
- **Auto-Modules:** Allows you to automatically disable certain modules that may conflict with a game.
  - Toggle Sprint in Parkour Builders, The Entity, and Alien Blast, and Environment Changer in Parkour Builders.
- **Chat Debloat:** Removes some spammy hub messages if you so choose.
- **Chat Editor:** Don't like the graphics? Want short badges? Want a name color Galaxite doesn't give you? This lets you have those and more!
- **Confirm Extra Things and Shops:** Makes you need to double-click to use Extra Things, so you don't accidentally use it in combat and die.
- **Event Scorer:** Keeps track of everything that happens in games and scores them automatically!
  - Currently only supports Chronos Solos.
- **Parkour Builders: Attempt Counter:** Insert Geometry Dash soundbyte here
- **WhereAmIHUD:** Automatically runs `/whereami` on joining any game, and keeps whatever details you want on screen too!
- There are also update notifications built-in, so you'll always know how to stay up-to-date!

## Details

### Future Plans
- **The Entity: Speedrun Timer:** Tracks how long a run takes, and in the future, full splits!
- **Kit UI:** Shows what perk, engine, or kit you're using, as well as what loot modifiers are in your Rush game.
- **Mythic Chest Timers:** For Rush and Chronos, automatically know when mythic chests will arrive!
- **Team UI:** Because Galaxite doesn't have this natively for some reason.

### Notes
`/whereami` will be ran a lot! This is since it gives a pretty good amount of information; it's one of the key ways for the plugin to know the game.

### Issues
I'm expecting a lot of desync-related bugs, so please include steps to reproduce anything weird you may find. Otherwise, just be clear.

I'm also cool with suggestions, but don't expect me to implement everything.

### PRs
I'll probably accept PRs for the following fairly quickly:
- Code cleanup
- Bug fixes
- Correcting random inconsistencies
- Fixing my syntax and other issues from lack of experience

I'll take a bit longer with modules, don't want them to be doing anything harmful, but I'm not against them being submitted. If you want to make a new module, in addition to normal Latite module things, make sure to add the following to the start of any file:
```ts
import { notOnGalaxite } from "./exports";
import { api } from "./WhereAmAPI";
```
as well as add this line of code to any event:
```ts
if(notOnGalaxite()) return;
```
Those will make the remainder of your code only occur on Galaxite. Beyond that, my only criteria is that it works and adds a new, useful feature; I'd especially be happy with modules for games I don't play a lot.

### Building
This uses [the template found here](https://github.com/LatiteScripting/Template) as a base, so it can be compiled with Ctrl-Shift-B in VS Code once cloned. Just make sure to download the Node modules first with `npm i`.

**You must have the plugin's development folder in a subfolder in the `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\RoamingState\LatiteRecode\Plugins` to build properly** I have mine in a folder labeled Projects in that directory.

The terminal command `npm run build` in the root folder also works.

## Credits
- Mojang, Blockception, and the Latite dev team
- [Seb](https://github.com/TwistedAsylumMC) for motivation and helping with some cues
- [Tom](https://github.com/CreeperG16) for the event emitter reimplementation
- [Jadon](https://github.com/ThatJadon26) for some very specific nerd functionality