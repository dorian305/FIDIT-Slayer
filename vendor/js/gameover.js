import { MainMenu } from "./mainmenu.js";
import { Graphics } from "./classes/Graphics.js";
import { Button } from "./classes/Button.js";
import { createSound } from "./functions/createsound.js"
import { stopSound } from "./functions/stopsound.js";
import { stopRendering }  from "./render.js";

export function gameOver(){
	stopRendering();
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
	const title = Graphics.createImage(`${PATH_IMAGES}/YouDied.png`);
	title.onload = () => {
		Graphics.drawImage({
			x: -CANVAS_EDGES.left + (innerWidth / 2) - title.width / 2,
			y: -CANVAS_EDGES.top + (innerHeight / 2) - title.height / 2 - 200,
			sprite: title
		});
	}
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

	// Stopping level music
	stopSound(LEVEL_MUSIC);
	LEVEL_MUSIC = null;

	// Playing game over music
	GAME_OVER_MUSIC = createSound(`${PATH_AUDIO}/YouDied.mp3`);
	GAME_OVER_MUSIC.play();

	// Destroy any remaining timers
	TIMERS.forEach(timer => {
		if (timer) timer.destroy();
	});
	TIMERS.length = 0;
}