import { Graphics } from "./classes/Graphics.js";
/*
	Main menu screen
*/
export function MainMenu(){
	Graphics.clearScreen();

	// Drawing logo
	Graphics.drawImage({x: 100, y: 100, sprite: Graphics.createImage("../../Assets/logo.png")});
}