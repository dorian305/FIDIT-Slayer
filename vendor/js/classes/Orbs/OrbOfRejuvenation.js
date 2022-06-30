import { Orb } from "./Orb.js";
import { removeFromArray } from "../../functions/removefromarray.js";
import { createSound }  from "../../functions/createsound.js";
/*
    Class OrbOfRejuvenation which is a collectible that restored player's HP by a certain amount.
*/
export class OrbOfRejuvenation extends Orb {
    constructor({x, y, w, h, sprite, healPercentage}){
        super({x, y, w, h, sprite});
        this.healPercentage = healPercentage;   // The amount of HP that will be restored when collecting orb of rejuvenation
        this.pickupSound = createSound(`${PATH_AUDIO}/Orbs/OrbOfRejuvenationPickup.wav`);
    }
    
    // Player has collected the orb
    collect(){
        // Collect orb only if PLAYER health is not full
        if (PLAYER.currentHP >= PLAYER.maxHP) return;

        PLAYER.currentHP = PLAYER.currentHP + (PLAYER.maxHP * this.healPercentage);
        if (PLAYER.currentHP > PLAYER.maxHP){
            PLAYER.currentHP = PLAYER.maxHP;
        }

        // Playing pickup sound
        this.pickupSound.play();
        
        // Remove the collected orb
        removeFromArray(ORBS, this);
    }
}