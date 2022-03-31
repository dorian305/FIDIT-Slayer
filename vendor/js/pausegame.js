import { Graphics }		  from "./classes/Graphics.js";
import { Button }		  from "./classes/Button.js";
import { MainMenu }		  from "./mainmenu.js";
import { startRendering } from "./render.js";

export function pauseGame(){
	GAME_PAUSED = !GAME_PAUSED;									// Update game paused flag
	/*
		If flag is true, game has been paused.
		Draw the overlay for paused game.
	*/
	if (GAME_PAUSED){
		// Dimmed overlay
		Graphics.drawRectangle({
			x: 0,
			y: 0,
			w: CANVAS.width,
			h: CANVAS.height,
			color: DIMMED_BACKGROUND_COLOR
		});
		// Title
		Graphics.drawText({
			x: CANVAS.width / 2,
			y: CANVAS.height / 2 - 200,
			size: 100,
			color: "White",
			content: `Paused`,
			align: "center",
			font: GAME_FONT
		});
		// Resume button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS.width / 2 - 100,
			y: CANVAS.height / 2 - 25,
			sprite: `${PATH_IMAGES}button.png`,
			text: "Resume",
			action: pauseGame
		});
		// Restart button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS.width / 2 - 100,
			y: CANVAS.height / 2 + 35,
			sprite: `${PATH_IMAGES}button.png`,
			text: "Restart",
			action: CURRENT_LEVEL
		});
		// Main menu button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS.width / 2 - 100,
			y: CANVAS.height / 2 + 95,
			sprite: `${PATH_IMAGES}button.png`,
			text: "Main menu",
			action: MainMenu
		});
		setTimeout(() => BUTTONS.forEach(button => button.draw()), 500);
	}
	/*
		Game has been unpaused.
		Remove all the buttons and continue game loop.
	*/
	else {
		startRendering();
		INGAME = true;
		GAME_PAUSED = false;
		BUTTONS.length = 0;
	}	
}

window.addEventListener("keydown", e => {
	if (e.key.toLowerCase() === "escape" && INGAME){
		pauseGame();
	}
});