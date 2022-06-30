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

	// Playing game over music
	stopSound(MUSIC);
	MUSIC = createSound(`${PATH_AUDIO}/YouDied.mp3`);
	MUSIC.loop = true;
	MUSIC.play();
}