import { Entity }   from "../Entity.js";
/*
    Class OrbOfHeal which is a collectible that restored player's HP by a certain amount.
*/
export class OrbOfHeal extends Entity {
    constructor({x, y, w, h, sprite, spriteLength, healPercentage}){
        super({x, y, w, h, sprite, spriteLength});
        this.healPercentage = healPercentage;                // The amount of HP that will be restored when collecting orb of health
        ORBS.push(this);
    }

    // Player has collected the orb
    checkCollected(){
        if (!(this.left > PLAYER.right || this.right < PLAYER.left || this.top > PLAYER.bottom || this.bottom < PLAYER.top)){
            // Check if player is at full health
            if (PLAYER.currentHP < PLAYER.maxHP){
                PLAYER.currentHP = PLAYER.currentHP + (PLAYER.maxHP * this.healPercentage);         // Heal the player
                ORBS.splice(ORBS.indexOf(this), 1);
            }
            // Do not collect the orb
            else {
                // ...
            }
        }
    }
}