import { Graphics } from "./Graphics.js";
/*
	Entity class.
	It is an abstract class containing properties shared by
	all types of movable objects in the game, such as platforms, characters,
	bullets etc...
*/
export class Entity {
	constructor({x, y, w, h, sprite, visible, color}){
		if (this.constructor === Entity){
			throw new Error(`Cannot instantiate an abstract class "Entity"!`);
		}
		this.position =       		{x, y};                        						// Position of the entity (X and Y coordinates)
    	this.size =           		{w, h};                        						// Width and height of the entity
		this.left =           		this.position.x;               						// Keeps track of the current left edge of the entity
    	this.right =          		this.position.x + this.size.w; 						// Keeps track of the current right edge of the entity 
		this.top =            		this.position.y;               						// Keeps track of the current top edge of the entity
		this.bottom =         		this.position.y + this.size.h; 						// Keeps track of the current bottom edge of the entity
		this.oldLeft =        		this.left;                     						// Keeps track of the old left edge of the entity
		this.oldRight =       		this.right;                    						// Keeps track of the old right edge of the entity
		this.oldTop =         		this.top;                     					 	// Keeps track of the old top edge of the entity
		this.oldBottom =      		this.bottom;                   						// Keeps track of the old bottom edge of the entity
		this.center = 				{													// Centerpoint of the entity
			x: this.left + this.size.w / 2,
			y: this.left + this.size.h / 2,
		}
		this.velocity =       		{x: 0, y: 0};                  						// X and Y components of entity velocity (+ = right and down, - = left and up)
		this.color = 				color;												// Color of the entity
		this.visible =		  		visible === false ? visible : true;					// Determine if entity sprite is drawn

		// If color is defined, skip sprite creation
		if (!this.color){
			this.sprite =         		sprite;												// Character sprite
			this.currentSprite =  		Graphics.createImage(this.sprite.default); 			// Image handler for sprite that will currently be displayed for the entity
			this.currentSprite.onload = () => {
			this.currentSpriteFrame =	0;                         							// Current frame of the animation
			this.spriteWidth =	  		this.currentSprite.width;		 					// Width of character sprite
			this.spriteLength =	  		Math.floor(this.spriteWidth / this.size.w); 		// Number of frames sprite animation consists of
			this.spriteFrameWidth = 	Math.floor(this.spriteWidth / this.spriteLength);	// Width of one sprite frame
			}
		}
	}

	/*
		Collision checking with other objects. Every entity can perform collision check against any other entity.
	*/
	checkCollision(other){
		// Skip other if it's null
		if (other){
			return !(
				this.left + this.velocity.x > other.right ||
				this.right + this.velocity.x < other.left ||
				this.top + this.velocity.y > other.bottom ||
				this.bottom + this.velocity.y < other.top
			)
		}
	}

	/*
		Updating sprite.
		Every frame, the new sprite frame is calculated based on current frame count
		times the width of the entity sprite frame.
	*/
	updateSpriteFrame(){
		if (this.currentSpriteFrame >= this.spriteLength - 1){
			this.currentSpriteFrame = 0;
		} else {
			this.currentSpriteFrame = this.currentSpriteFrame + 1;
		}
	}

	// Drawing the entity
	draw() {
		// Draw entity sprite if it's not hidden
    	if (this.visible !== false){
			if (this.color){
				Graphics.drawRectangle({
					x: this.position.x,
					y: this.position.y,
					w: this.size.w,
					h: this.size.h,
					color: this.color,
					ctx: GAME_CTX,
				})
			}
			else {
				GAME_CTX.drawImage(
					this.currentSprite,
					this.currentSpriteFrame * this.spriteFrameWidth,
					0,
					this.size.w,
					this.size.h,
					this.position.x,
					this.position.y,
					this.size.w,
					this.size.h
				);
			}
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
		this.center.x =			this.left + this.size.w / 2;
		this.center.y =			this.top + this.size.h / 2;

		// Periodically updating entity sprite
		if (!this.color){
			this.updateSpriteFrame();
		}
		
		// Draw entity at updated coordinates
		this.draw();
	}
}