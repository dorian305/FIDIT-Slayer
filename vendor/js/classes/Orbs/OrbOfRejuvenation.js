import { Orb } from "./Orb.js";
import { removeFromArray } from "../../functions/removefromarray.js";
/*
    Class OrbOfRejuvenation which is a collectible that restored player's HP by a certain amount.
*/
export class OrbOfRejuvenation extends Orb {
    constructor({x, y, w, h, sprite, healPercentage}){
        super({x, y, w, h, sprite});
        this.healPercentage = healPercentage;                // The amount of HP that will be restored when collecting orb of rejuvenation
    }
    // Player has collected the orb
    checkCollected(){
        // Check if player is at full health
        if (PLAYER.currentHP < PLAYER.maxHP){
            // Heal the player
            PLAYER.currentHP = PLAYER.currentHP + (PLAYER.maxHP * this.healPercentage);
            if (PLAYER.currentHP > PLAYER.maxHP){
                PLAYER.currentHP = PLAYER.maxHP;
            }
            // Remove the collected orb
            removeFromArray(ORBS, this);
        }
        // Do not collect the orb
        else {
            // ...
        }
    }
}