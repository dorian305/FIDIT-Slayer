import { MainMenu } from "./mainmenu.js";
import { Graphics } from "./classes/Graphics.js";
import { Button } from "./classes/Button.js";
import { createSound } from "./functions/createsound.js"
import { stopSound } from "./functions/stopsound.js";
import { stopRendering }  from "./render.js";

export const gameOver = () => {
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
		x: 0,
		y: 0,
		w: CANVAS_UI.width,
		h: CANVAS_UI.height,
		color: DIMMED_BACKGROUND_COLOR,
		ctx: UI_CTX,
	});
	// Title
	const title = Graphics.createImage(`${PATH_IMAGES}/YouDied.png`);
	title.onload = () => {
		Graphics.drawImage({
			x: CANVAS_UI.width / 2,
			y: CANVAS_UI.height / 2 - 200,
			sprite: title,
			ctx: UI_CTX,
			align: "center",
		});
	}
	// Restart button
	new Button({
		w: 200,
		h: 50,
		x: CANVAS_UI.width / 2 - 100,
		y: CANVAS_UI.height / 2 - 25,
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
		y: CANVAS_UI.height / 2 + 35,
		sprite: `${PATH_IMAGES}/Button.png`,
		text: "Main menu",
		action: MainMenu,
		ctx: UI_CTX,
	});

	// Playing game over music
	stopSound(MUSIC);
	MUSIC = createSound(`${PATH_AUDIO}/YouDied.mp3`);
	MUSIC.loop = true;
	MUSIC.play();
}