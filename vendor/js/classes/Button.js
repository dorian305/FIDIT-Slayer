import { Graphics } from "./Graphics.js";

/*
	Button class. Used for creating buttons in game UI such as
	pause game, game lost, main menu etc...
*/
export class Button {
	constructor({x, y, w, h, ctx, sprite, text, action}){
		this.position = 	  {x, y};
		this.size = 		  {w, h};
		this.sprite =		  Graphics.createImage(sprite);	 // Button sprite
		this.text =		      text;							 // Button text content
		this.action =         action;						 // The function tied to the button's action
		this.ctx = 			  ctx;							 // On which canvas the button is drawn
		BUTTONS.push(this);
		
		// Draw the buttons when the images load
		this.sprite.onload = () => {
			this.draw();
		}
	}

	draw() {
		Graphics.drawImage({
			x: this.position.x,
			y: this.position.y,
			ctx: this.ctx,
			sprite: this.sprite,
		});
		Graphics.drawText({
			x: this.position.x + this.size.w / 2,
			y: this.position.y + this.size.h / 2 + 6,
			size: 18,
			color: "Gray",
			content: this.text,
			align: "center",
			font: GAME_FONT,
			ctx: this.ctx,
		});
	}
}