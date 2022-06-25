import { Graphics } 		from "./classes/Graphics.js";
import { introCutscene } 	from "./introcutscene.js";
import { Button }		  	from "./classes/Button.js";
import { stopRendering }  	from "./render.js";
import { createSound } 		from "./functions/createsound.js"
import { stopSound } 		from "./functions/stopsound.js";
/*
	Main menu screen
*/
export function MainMenu(){
	Graphics.clearScreen();
	stopRendering();

	// Resetting
	BUTTONS.length = 0;
	CANVAS_EDGES = {left: 0, top: 0, right: 0, bottom: 0};
	CANVAS.width = document.getElementById("canvas-wrapper").clientWidth;
	CANVAS.height = document.getElementById("canvas-wrapper").clientHeight;
	CANVAS.style = "";
	const x = CANVAS.width / 2;
	const y = CANVAS.height / 2;
	INGAME = false;
	GAME_PAUSED = false;
	if (LEVEL_MUSIC) stopSound(LEVEL_MUSIC);
	LEVEL_MUSIC = null;

	// Drawing logo
	const logo = Graphics.createImage(`${PATH_IMAGES}/logo.png`);
	logo.onload = () => {
		Graphics.drawImage({
			x: x - logo.width / 2,
			y: y - logo.height / 2,
			sprite: logo
		});
	}

	// Main menu music
	const mainMenuAudio = createSound(`${PATH_AUDIO}/Main Menu/MainMenuMusic.mp3`);
	mainMenuAudio.loop = true;
	mainMenuAudio.play();

	// Start new game button
	new Button({
		w: 200,
		h: 50,
		x: x - 100,
		y: y + 125,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "Start new game",
		action: () => {
			// Starting intro sequence
			introCutscene();
			BUTTONS.length = 0;
			stopSound(mainMenuAudio);
		}
	});
}
MainMenu();