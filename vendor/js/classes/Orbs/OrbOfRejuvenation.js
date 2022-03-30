import { Orb } from "./Orb.js";
/*
    Class OrbOfRejuvenation which is a collectible that restored player's HP by a certain amount.
*/
export class OrbOfRejuvenation extends Orb {
    constructor({x, y, w, h, sprite, spriteLength, healPercentage}){
        super({x, y, w, h, sprite, spriteLength});
        this.healPercentage = healPercentage;                // The amount of HP that will be restored when collecting orb of rejuvenation
    }
    // Player has collected the orb
    checkCollected(){
        if (this.checkCollision(PLAYER)){
            // Check if player is at full health
            if (PLAYER.currentHP < PLAYER.maxHP){
                // Heal the player
                PLAYER.currentHP = PLAYER.currentHP + (PLAYER.maxHP * this.healPercentage);
                if (PLAYER.currentHP > PLAYER.maxHP){
                    PLAYER.currentHP = PLAYER.maxHP;
                }
                // Remove the collected orb
                ORBS.splice(ORBS.indexOf(this), 1);
            }
            // Do not collect the orb
            else {
                // ...
            }
        }
    }
}