import { Graphics } 		from "./classes/Graphics.js";
import { introCutscene } 	from "./introcutscene.js";
import { Button }		  	from "./classes/Button.js";
import { stopRendering }  	from "./render.js";
import { createSound } 		from "./functions/createsound.js";
import { stopSound } from "./functions/stopsound.js";

/*
	Main menu screen.
*/
export function MainMenu(){
	/*
		Stopping rendering and clearing screen.
	*/
	stopRendering();
	Graphics.clearScreen();

	/*
		Resetting game variables after returning to main menu.
	*/
	PLAYER = null;
	BUTTONS.length = 0;
	INGAME = false;
	GAME_PAUSED = false;
	DEBUG_MODE = false;
	PLAYER_ENTERED_BOSS_AREA = false;
	BOSS_FIGHT = null;
	BOSS = null;
	BOSS_AREA = {};
	ENEMIES.length = 0;
	PLATFORMS.length = 0;
	GENERIC_OBJECTS.length = 0;
	BUTTONS.length = 0;
	ORBS.length = 0;
	MISSILES.length = 0;
	FIREBALLS.length = 0;
	EFFECTS.length = 0;
	TIMERS.length = 0;
	CURRENT_LEVEL = null;
	LEVEL_BEGINNING_EDGE = null;
	LEVEL_END_EDGE = null;
	stopSound(MUSIC);
	MUSIC = null;

	/*
		Resetting canvas to default settings.
	*/
	CANVAS_EDGES = {left: 0, top: 0, right: 0, bottom: 0};
	CANVAS.width = document.getElementById("canvas-wrapper").clientWidth;
	CANVAS.height = document.getElementById("canvas-wrapper").clientHeight;
	CANVAS.style = "";

	/*
		Drawing main menu logo.
	*/
	const logo = Graphics.createImage(`${PATH_IMAGES}/Logo.png`);
	logo.onload = () => {
		Graphics.drawImage({
			x: CANVAS.width / 2 - logo.width / 2,
			y: CANVAS.height / 2 - logo.height / 2,
			sprite: logo
		});
	}

	/*
		Playing main menu music.
	*/
	MUSIC = createSound(`${PATH_AUDIO}/Main Menu/MainMenuMusic.mp3`);
	MUSIC.loop = true;
	MUSIC.play();

	/*
		Drawing main menu buttons.
	*/
	// New game
	new Button({
		w: 200,
		h: 50,
		x: CANVAS.width / 2 - 100,
		y: CANVAS.height / 2 + 125,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "New game",
		action: () => {
			introCutscene();		// Playing intro cutscene on new game
			BUTTONS.length = 0;		// Clearing buttons
			stopSound(MUSIC);		// Stopping music
		}
	});
}
MainMenu();