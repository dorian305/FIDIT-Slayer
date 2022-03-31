import { Orb } from "./Orb.js";
import { removeFromArray } from "../../functions/removefromarray.js";

/*
    Class OrbOfHealth which is a collectible that increases player's total HP by a certain amount.
*/
export class OrbOfHealth extends Orb {
    constructor({x, y, w, h, sprite, HPIncrease}){
        super({x, y, w, h, sprite});
        this.HPIncrease = HPIncrease;                // The amount of HP that will be added to a player total HP
    }
    // Player has collected the orb
    checkCollected(){
        // Increase player maxHP
        PLAYER.maxHP = PLAYER.maxHP + this.HPIncrease;
        PLAYER.currentHP = PLAYER.maxHP;
        // Remove the collected orb
        removeFromArray(ORBS, this);
    }
}