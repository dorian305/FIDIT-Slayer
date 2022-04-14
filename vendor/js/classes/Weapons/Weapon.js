import { Entity }       from "../Entity.js";
import { Missile }      from "./Missile.js";
import { Effect }       from "../Effect.js";
import { stopSound }    from "../../functions/stopsound.js";

/*
    Instantiate a new weapon instance from this class. Weapons have their sound, sprite animation, damage...
*/
export class Weapon extends Entity {
    constructor({x, y, w, h, sprite, name, damage, sound, missileSpeed, missileSize, fireEffectSize}){
        super({x, y, w, h, sprite});
        this.name =             name;
        this.damage =           damage;
        this.sound =            sound;
        this.missileSpeed =     missileSpeed;
        this.missileSize =      missileSize;
        this.fireEffectSize =   fireEffectSize;
    }

    // Executing weapon's attack
    attack({missileSprite, missilePosition, missileVelocity, missileSize}) {
        // Creating the missile
        const missile = new Missile({
            x: missilePosition.x,
            y: missilePosition.y,
            w: missileSize.w,
            h: missileSize.h,
            sprite: {
                default: missileSprite
            },
            damage: this.damage,
        });
        missile.velocity.x = missileVelocity.x;
        missile.velocity.y = missileVelocity.y;

        // Create missile fire effect on missile creation
		new Effect({
			x: missilePosition.x - this.fireEffectSize.w / 2,
			y: missilePosition.y - this.fireEffectSize.h / 2,
			w: this.fireEffectSize.w,
			h: this.fireEffectSize.h,
			sprite: {
				default: this.sprite.fire,
			},
		});

        // Playing the weapon fire sound effect
        stopSound(this.sound);
        this.sound.play();
    }
}