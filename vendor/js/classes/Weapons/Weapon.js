import { Missile }      from "./Missile.js";
import { Effect }       from "../Effect.js";
import { stopSound }    from "../../functions/stopsound.js";

/*
    Instantiate a new weapon instance from this class. Weapons have their sound, sprite animation, damage...
*/
export class Weapon {
    constructor({name, damage, sound, missileSpeed, missileSize, fireEffectSize, missileSprite}){
        this.name =             name;
        this.damage =           damage;
        this.sound =            sound;
        this.missileSpeed =     missileSpeed;
        this.missileSize =      missileSize;
        this.fireEffectSize =   fireEffectSize;
        this.missileSprite =    missileSprite;
    }

    // Executing weapon's attack
    attack({missileSprite, missileFireEffectSprite, missilePosition, missileVelocity, missileSize, missileOwner}){
        // Creating the missile
        new Missile({
            x: missilePosition.x - missileSize.w / 2,
            y: missilePosition.y - missileSize.h / 2,
            w: missileSize.w,
            h: missileSize.h,
            velocity: {
                x: missileVelocity.x,
                y: missileVelocity.y,
            },
            sprite: {
                default: missileSprite
            },
            damage: this.damage,
            owner: missileOwner,
        });

        // Create missile fire effect on missile creation
		new Effect({
			x: missilePosition.x - this.fireEffectSize.w / 2,
			y: missilePosition.y - this.fireEffectSize.h / 2,
			w: this.fireEffectSize.w,
			h: this.fireEffectSize.h,
			sprite: {
				default: missileFireEffectSprite,
			},
		});

        // Playing the weapon fire sound effect
        stopSound(this.sound);
        this.sound.play();
    }
}