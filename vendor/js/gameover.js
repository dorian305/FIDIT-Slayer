import { MainMenu } from "./mainmenu.js";
import { Graphics } from "./classes/Graphics.js";
import { Button }   from "./classes/Button.js";

export function gameOver(){
	/*
		Removing existing level data.
	*/
	GENERIC_OBJECTS.length =		0;
	PLATFORMS.length =				0;
	ENEMIES.length =				0;
	INGAME =						false;
	GAME_PAUSED =					false;
	/*
		Playing death sound and animation of player character.
	*/
	PLAYER.deathSound.play();
	/*
		Displaying game lost overlay.
		The overlay contains dimmed background over entire screen, title text,
		and buttons to select an option.
	*/
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
		color: "#940707",
		content: `YOU DIED`,
		align: "center",
		font: GAME_FONT
	});
	// Restart button
	new Button({
		w: 200,
		h: 50,
		x: CANVAS.width / 2 - 100,
		y: CANVAS.height / 2 - 25,
		sprite: `${PATH_IMAGES}button.png`,
		text: "Restart",
		action: CURRENT_LEVEL																	// Button's action is to restart the curent level
	});
	// Main menu button
	new Button({
		w: 200,
		h: 50,
		x: CANVAS.width / 2 - 100,
		y: CANVAS.height / 2 + 35,
		sprite: `${PATH_IMAGES}button.png`,
		text: "Main menu",
		action: MainMenu
	});
	setTimeout(() => BUTTONS.forEach(button => button.draw()), 1000);
}