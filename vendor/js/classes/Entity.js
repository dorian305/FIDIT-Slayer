import { Graphics } from "./Graphics.js";
/*
	Entity class.
	It is an abstract class containing properties shared by
	all types of movable objects in the game, such as platforms, characters,
	bullets etc...
*/
export class Entity {
	constructor({x, y, w, h, sprite, spriteLength, visible}){
		if (this.constructor === Entity){
			throw new Error(`Cannot instantiate an abstract class "Entity"!`);
		}
		this.position =       {x, y};                        // Position of the entity (X and Y coordinates)
    	this.size =           {w, h};                        // Width and height of the entity
		this.left =           this.position.x;               // Keeps track of the current left edge of the entity
    	this.right =          this.position.x + this.size.w; // Keeps track of the current right edge of the entity 
		this.top =            this.position.y;               // Keeps track of the current top edge of the entity
		this.bottom =         this.position.y + this.size.h; // Keeps track of the current bottom edge of the entity
		this.oldLeft =        this.left;                     // Keeps track of the old left edge of the entity
		this.oldRight =       this.right;                    // Keeps track of the old right edge of the entity
		this.oldTop =         this.top;                      // Keeps track of the old top edge of the entity
		this.oldBottom =      this.bottom;                   // Keeps track of the old bottom edge of the entity
		this.velocity =       {x: 0, y: 0};                  // X and Y components of entity velocity (+ = right and down, - = left and up)
		this.sprite =         Graphics.createImage(sprite);  // Image handler for entity sprite
		this.spriteLength =	  spriteLength;                  // Number of frames sprite animation consists of
		this.spriteFrame =    0;                             // Current frame of the animation
		this.visible =		  visible;				 		 // Determine if entity sprite is drawn
	}

	// Drawing the entity
	draw() {
		// Draw entity sprite if it's not hidden
    	if (this.visible !== false){
			Graphics.drawImage({x: this.position.x, y: this.position.y, sprite: this.sprite});
		}
	}

	// Updating entity properties
	update() {
		this.oldLeft =          this.left;									// Update old left to current left
		this.oldRight =         this.right;									// Update old right to current right
		this.position.x =       this.position.x + this.velocity.x;			// Update X coordinate
		this.left =             this.position.x;							// Update current left to new X coordinate
		this.right =            this.position.x + this.size.w;				// Update current right to new X coordinate + width
		this.oldTop =           this.top;									// Update old top to current top
		this.oldBottom =        this.bottom;								// Update old bottom to current bottom
		this.position.y =       this.position.y + this.velocity.y;			// Update Y coordinate
		this.top =              this.position.y;							// Update current top to new Y coordinate
		this.bottom =           this.position.y + this.size.h;				// Update current bottom to new Y coordinate + height

		// Updating sprite frame for animation
		if (this.spriteLength === undefined || this.spriteFrame >= this.spriteLength){
			this.spriteFrame = 0;
		} else {
			this.spriteFrame = this.spriteFrame + 1;
		}

		// Draw entity at updated coordinates
		this.draw();
	}
}