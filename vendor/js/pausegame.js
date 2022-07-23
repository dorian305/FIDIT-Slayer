import { Graphics }		  from "./classes/Graphics.js";
import { Button }		  from "./classes/Button.js";
import { MainMenu }		  from "./mainmenu.js";
import { startRendering } from "./render.js";
import { stopRendering }  from "./render.js";

export const pauseGame = () => {
	/*
		If flag is true, game has been paused.
		Draw the overlay for paused game.
	*/
	if (GAME_PAUSED){
		stopRendering(); // Stop rendering if paused
		// Dimmed overlay
		Graphics.drawRectangle({
			x: 0,
			y: 0,
			w: CANVAS_UI.width,
			h: CANVAS_UI.height,
			color: DIMMED_BACKGROUND_COLOR,
			ctx: UI_CTX,
		});
		// Title
		const title = Graphics.createImage(`${PATH_IMAGES}/Paused.png`);
		title.onload = () => {
			Graphics.drawImage({
				x: CANVAS_UI.width / 2,
				y: CANVAS_UI.height / 2 - 200,
				sprite: title,
				ctx: UI_CTX,
				align: "center",
			});
		}
		// Resume button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS_UI.width / 2 - 100,
			y: CANVAS_UI.height / 2 - 25,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Resume",
			action: pauseGame,
			ctx: UI_CTX,
		});
		// Restart button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS_UI.width / 2 - 100,
			y: CANVAS_UI.height / 2 + 35,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Restart",
			action: CURRENT_LEVEL,
			ctx: UI_CTX,
		});
		// Main menu button
		new Button({
			w: 200,
			h: 50,
			x: CANVAS_UI.width / 2 - 100,
			y: CANVAS_UI.height / 2 + 95,
			sprite: `${PATH_IMAGES}/Button.png`,
			text: "Main menu",
			action: MainMenu,
			ctx: UI_CTX,
		});

		// Pause running timers
		TIMERS.forEach(timer => {if (timer) timer.pause()});
	}
	/*
		Game has been unpaused.
		Remove all the buttons and continue render.
	*/
	else {
		startRendering();
		BUTTONS.length = 0;

		// Resume timers
		TIMERS.forEach(timer => {if (timer) timer.resume()});
	}	
}