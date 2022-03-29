import { Graphics } from "./Graphics.js";

/*
	Button class. Used for creating buttons in game UI such as
	pause game, game lost, main menu etc...
*/
export class Button {
	constructor({x, y, w, h, sprite, text, action}){
		this.position =       {x, y};                        // Position of the button (X and Y coordinates)
    	this.size =           {w, h};                        // Width and height of the button
		this.sprite =		  Graphics.createImage(sprite);	 // Button sprite
		this.text =		      text;							 // Button text content
		this.action =         action;						 // The function tied to the button's action
		BUTTONS.push(this);
	}

	draw() {
		const buttonTextSize = 18;
		const buttonTextColor = "Gray";
		const buttonTextAlignment = "center";
		Graphics.drawImage({x: this.position.x, y: this.position.y, sprite: this.sprite});
		Graphics.drawText({x: this.position.x + (this.size.w / 2), y: this.position.y + (this.size.h / 4) + buttonTextSize, size: buttonTextSize, color: buttonTextColor, content: this.text, align: buttonTextAlignment, font: GAME_FONT});
	}
}