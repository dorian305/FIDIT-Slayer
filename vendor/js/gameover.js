import { MainMenu } from "./mainmenu.js";
import { Graphics } from "./classes/Graphics.js";
import { Button }   from "./classes/Button.js";

export function gameOver(){
	/*
		Removing existing level data.
	*/
	GENERIC_OBJECTS.length =  		0;
	PLATFORMS.length = 				0;
	ENEMIES.length = 				0;
	MISSILES.length = 				0;
	EFFECTS.length = 				0;
	BUTTONS.length = 				0;
	ORBS.length = 					0;
	FIREBALLS.length = 				0;
	INGAME =						false;
	GAME_PAUSED =					false;
	/*
		Playing death sound and animation of player character.
	*/
	// PLAYER.deathSound.play();
	/*
		Displaying game lost overlay.
		The overlay contains dimmed background over entire screen, title text,
		and buttons to select an option.
	*/
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
		color: "#940707",
		content: `YOU DIED`,
		align: "center",
		font: GAME_FONT
	});
	// Restart button
	new Button({
		x: -CANVAS_EDGES.left + (innerWidth / 2) - 100,
		y: -CANVAS_EDGES.top + (innerHeight / 2) - 25,
		w: 200,
		h: 50,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "Restart",
		action: CURRENT_LEVEL	// Button's action is to restart the current level
	});
	// Main menu button
	new Button({
		x: -CANVAS_EDGES.left + (innerWidth / 2) - 100,
		y: -CANVAS_EDGES.top + (innerHeight / 2) + 35,
		w: 200,
		h: 50,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "Main menu",
		action: MainMenu
	});

	// Destroy any remaining timers
	TIMERS.forEach(timer => {
		if (timer) timer.destroy();
	});
	TIMERS.length = 0;
}