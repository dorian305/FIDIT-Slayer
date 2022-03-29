import { Orb } from "./Orb.js";
/*
    Class OrbOfHealth which is a collectible that increases player's total HP by a certain amount.
*/
export class OrbOfHealth extends Orb {
    constructor({x, y, w, h, sprite, spriteLength, HPIncrease}){
        super({x, y, w, h, sprite, spriteLength});
        this.HPIncrease = HPIncrease;                // The amount of HP that will be added to a player total HP
    }
    // Player has collected the orb
    checkCollected(){
        if (this.checkCollision(PLAYER)){
            // Increase player maxHP
            PLAYER.maxHP = PLAYER.maxHP + this.HPIncrease;
            PLAYER.currentHP = PLAYER.maxHP;
            // Remove the collected orb
            ORBS.splice(ORBS.indexOf(this), 1);
        }
    }
}