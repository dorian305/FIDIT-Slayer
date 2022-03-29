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
		CTX.clearRect(0, 0, CANVAS.width, CANVAS.height); // Clears entire canvas content
	}

	static drawLine({x1, y1, x2, y2, thickness, color}){
	  CTX.lineWidth = thickness;                          // Set the line width
	  CTX.strokeStyle = color;                            // Set the color of the line
	  
	  CTX.beginPath();
	  CTX.moveTo(x1, y1);                                 // Set the origin point of the line to (x1, y1)
	  CTX.lineTo(x2, y2);                                 // Set the target point of the line to (x2, y2)
	  CTX.stroke();                                       // Draw the line from origin to target point
	}

	static drawRectangle({x, y, w, h, color}){
	  CTX.fillStyle = color;                              // Set the color of the rectangle
	  CTX.fillRect(x, y, w, h);                       	  // Draw the rectangle at X and Y coordinates
	}

	static drawText({x, y, size, color, content, align, font}){
	  CTX.font = `${size}px ${font}`;					  // Set the text font
	  CTX.fillStyle = color;							  // Set the text color
	  CTX.textAlign = align;							  // Set text alignment
	  CTX.fillText(content, x, y);						  // Draw the text at X and Y coordinates
	}

	static drawImage({x, y, sprite}){
		CTX.drawImage(sprite, x, y);					 // Draw the image at X and Y coordinates
	}

	static createImage(image){
	  const img = new Image;							 // Create new image handler
	  img.src = image;									 // Set source
	  return img;										 // Return image handler
	}
}