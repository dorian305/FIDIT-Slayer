import { Graphics }		  from "./classes/Graphics.js";
import { Button }		  from "./classes/Button.js";
import { MainMenu }		  from "./mainmenu.js";
import { startRendering } from "./render.js";
import { stopRendering }  from "./render.js";

function pauseGame(){
	GAME_PAUSED = !GAME_PAUSED;									// Update game paused flag
	stopRendering();
	/*
		If flag is true, game has been paused.
		Draw the overlay for paused game.
	*/
	if (GAME_PAUSED){
		// Dimmed overlay
		Graphics.drawRectangle({
			x: -CANVAS_EDGES.left,
			y: -CANVAS_EDGES.top,
			w: innerWidth,
			h: innerHeight,
			color: DIMMED_BACKGROUND_COLOR
		});
		// Title
		Graphics.drawText({
			x: -CANVAS_EDGES.left + (innerWidth / 2),
			y: -CANVAS_EDGES.top + (innerHeight / 2) - 200,
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
			x: -CANVAS_EDGES.left + (innerWidth / 2) - 100,
			y: -CANVAS_EDGES.top + (innerHeight / 2) - 25,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Resume",
			action: pauseGame
		});
		// Restart button
		new Button({
			w: 200,
			h: 50,
			x: -CANVAS_EDGES.left + (innerWidth / 2) - 100,
			y: -CANVAS_EDGES.top + (innerHeight / 2) + 35,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Restart",
			action: CURRENT_LEVEL
		});
		// Main menu button
		new Button({
			w: 200,
			h: 50,
			x: -CANVAS_EDGES.left + (innerWidth / 2) - 100,
			y: -CANVAS_EDGES.top + (innerHeight / 2) + 95,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Main menu",
			action: MainMenu
		});

		// Pause running timers
		TIMERS.forEach(timer => {
			if (timer) timer.pause();
		});
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

		// Resume timers
		TIMERS.forEach(timer => {
			if (timer) timer.resume();
		});
	}	
}

/*
	Pausing the game.
*/
window.addEventListener("keydown", e => {
	if (e.key.toLowerCase() === "escape" && INGAME){
		pauseGame();
	}
});