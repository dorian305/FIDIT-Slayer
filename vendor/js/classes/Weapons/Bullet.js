import { removeFromArray } from "../../functions/removefromarray.js";
import { Entity } from "../Entity.js";

export class Bullet extends Entity {
    constructor({x, y, w, h, sprite, damage}){
        super({x, y, w, h, sprite});
        this.damage =               damage;             // Amount of damage the bullet deals
        BULLETS.push(this);
    }

	// Bullets collision with platforms
	collider2D(){
		PLATFORMS.forEach(platform => {
			if (this.checkCollision(platform)){
				removeFromArray(BULLETS, this);
			}
		});
	}

	update() {
		// Remove the bullet if it gets beyond the screen top or screen bottom
		if (this.top < 0 || this.bottom > CANVAS.height){
			removeFromArray(BULLETS, this);
		}

		this.collider2D();

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