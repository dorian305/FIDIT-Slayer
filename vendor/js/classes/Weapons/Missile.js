import { Entity } 			from "../Entity.js";
import { Effect } 			from "../Effect.js";
import { createSound } 		from "../../functions/createsound.js";
import { removeFromArray } 	from "../../functions/removefromarray.js";

export class Missile extends Entity {
    constructor({x, y, w, h, sprite, damage}){
        super({x, y, w, h, sprite});
        this.damage = damage;
        MISSILES.push(this);
    }

	// Missiles collision with platforms
	collider2D(){
		PLATFORMS.forEach(platform => {
			if (this.checkCollision(platform)){
				// Check if platform is destroyable. If it is, damage it
				if (platform.destroyable){
					if (platform.HP - this.damage < 0){
						this.damage = platform.HP;
					}
					platform.HP = platform.HP - this.damage;
					/*
					If the platform is destroyed, remove it from array and create a generic object
					showing explosion from platform destruction and sound effect.
					*/
					if (platform.HP <= 0){
						new Effect({
							x: platform.left - 37.5,
							y: platform.top - 37.5,
							w: 150,
							h: 150,
							sprite: {
								default: `${PATH_SPRITES}/Effects/PlatformDestroyExplosion.png`,
							},
						});
						let explosionSound = createSound(`${PATH_AUDIO}/Effects/PlatformDestructionSound.mp3`);
						explosionSound.play();
						removeFromArray(PLATFORMS, platform);
					}
				}
				// Destroy the missile
				removeFromArray(MISSILES, this);
			}
		});
	}

	update() {
		// Remove the missile if it gets beyond the screen top or screen bottom
		if (this.top < 0 || this.bottom > CANVAS.height){
			removeFromArray(MISSILES, this);
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

		// Draw entity at updated coordinates
		this.draw();
	}
}