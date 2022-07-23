/*
	Class Graphics is an abstract class that contains methods that can be used to
	draw generic shapes on the canvas such as rectangles, texts, lines, circles, images etc...
*/
export class Graphics {
	constructor(){
		if (this.constructor === Graphics){
			throw new Error("Cannot instantiate an abstract class \"Graphics\"!");
		}
	}

	static clearScreen(){
		GAME_CTX.clearRect(0, 0, CANVAS_GAME.width, CANVAS_GAME.height);
		UI_CTX.clearRect(0, 0, CANVAS_UI.width, CANVAS_UI.height);
	}

	static drawLine({x1, y1, x2, y2, thickness, color, ctx}){
		ctx.lineWidth = thickness;                          // Set the line width
		ctx.strokeStyle = color;                            // Set the color of the line
	  
		ctx.beginPath();
		ctx.moveTo(x1, y1);                                 // Set the origin point of the line to (x1, y1)
		ctx.lineTo(x2, y2);                                 // Set the target point of the line to (x2, y2)
		ctx.stroke();                                       // Draw the line from origin to target point
	}

	static drawRectangle({x, y, w, h, color, ctx}){
		ctx.fillStyle = color;                              // Set the color of the rectangle
		ctx.fillRect(x, y, w, h);                       	// Draw the rectangle at X and Y coordinates
	}

	static drawText({x, y, size, color, content, align, font, ctx}){
		ctx.font = `${size}px ${font}`;					  // Set the text font
		ctx.fillStyle = color;							  // Set the text color
		ctx.textAlign = align;							  // Set text alignment
		ctx.fillText(content, x, y);					  // Draw the text at X and Y coordinates
	}

	static drawImage({x, y, ctx, sprite, align}){		  // Draw the image centered at X and Y coordinates
		if (align === 'center'){
			ctx.drawImage(sprite, x - sprite.width / 2, y - sprite.height / 2);
		}
		else {
			ctx.drawImage(sprite, x, y);				 // Draw the image at X and Y coordinates
		}
	}

	// Drawing the outline
	static drawOutline({x, y, w, h, thickness, color, ctx}){
		Graphics.drawLine({x1: x, y1: y, x2: x + w, y2: y, thickness: thickness, color: color, ctx: ctx});    // Top line
		Graphics.drawLine({x1: x, y1: y + h, x2: x + w, y2: y + h, thickness: thickness, color: color, ctx: ctx});    // Bottom line
		Graphics.drawLine({x1: x, y1: y, x2: x, y2: y + h, thickness: thickness, color: color, ctx: ctx});        // Left line
		Graphics.drawLine({x1: x + w, y1: y, x2: x + w, y2: y + h, thickness: thickness, color: color, ctx: ctx});      // Right line
	}

	static createImage(image){
	  const img = new Image;							 // Create new image handler
	  img.src = image;									 // Set source
	  return img;										 // Return image handler
	}
}