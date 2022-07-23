import { Entity } 			from "../Entity.js";
import { Effect } 			from "../Effect.js";
import { createSound } 		from "../../functions/createsound.js";
import { removeFromArray } 	from "../../functions/removefromarray.js";

export class Missile extends Entity {
    constructor({x, y, w, h, sprite, velocity, damage, owner}){
        super({x, y, w, h, sprite});
		this.velocity = velocity;
        this.damage = damage;
		this.owner = owner; 	// The owner of the missile isn't damaged by the missile
        MISSILES.push(this);
    }

	// Missiles collision with platforms
	collider2D(){
		PLATFORMS.forEach(platform => {
			if (this.checkCollision(platform) && platform.visible && !platform.landingOnly){
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
							x: platform.center.x - platform.destroyExplosionSpriteSize.w / 2,
							y: platform.center.y - platform.destroyExplosionSpriteSize.h / 2,
							w: platform.destroyExplosionSpriteSize.w,
							h: platform.destroyExplosionSpriteSize.h,
							sprite: {
								default: platform.destroyExplosionSprite,
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
		// Remove the missile if it gets beyond the viewport
		if (
			this.top < Math.abs(parseFloat(CANVAS_GAME.style.marginTop)) ||
			this.left < Math.abs(parseFloat(CANVAS_GAME.style.marginLeft)) ||
			this.bottom > Math.abs(parseFloat(CANVAS_GAME.style.marginTop)) + CANVAS_WRAPPER.clientHeight ||
			this.right > Math.abs(parseFloat(CANVAS_GAME.style.marginLeft)) + CANVAS_WRAPPER.clientWidth
		){
			removeFromArray(MISSILES, this);
		}
		
		this.updateSpriteFrame();

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
		this.center.x =			this.left + this.size.w / 2;
		this.center.y =			this.top + this.size.h / 2;

		// Draw entity at updated coordinates
		this.draw();
	}
}