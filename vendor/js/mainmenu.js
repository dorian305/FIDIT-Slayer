import { Graphics } 		from "./classes/Graphics.js";
import { introCutscene } 	from "./introcutscene.js";
import { Button }		  	from "./classes/Button.js";
import { stopRendering }  	from "./render.js";
import { stopSound } 		from "./functions/stopsound.js";
/*
	Main menu screen
*/
export function MainMenu(){
	Graphics.clearScreen();
	stopRendering();

	// Resetting
	BUTTONS.length = 0;
	CANVAS.width = document.body.clientWidth;
	CANVAS.height = document.body.clientHeight;
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
			y: y - logo.height / 2 - 200,
			sprite: logo
		});
	}

	// Creating main menu buttons
	new Button({
		w: 200,
		h: 50,
		x: x - 100,
		y: y - 25,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "Start new game",
		action: () => {
			// Starting intro sequence
			introCutscene();
			BUTTONS.length = 0;
		}
	});
}
MainMenu();