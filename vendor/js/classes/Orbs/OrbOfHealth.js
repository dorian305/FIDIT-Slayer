import { Orb } from "./Orb.js";
import { removeFromArray } from "../../functions/removefromarray.js";
import { createSound }  from "../../functions/createsound.js";

/*
    Class OrbOfHealth which is a collectible that increases player's total HP by a certain amount.
*/
export class OrbOfHealth extends Orb {
    constructor({x, y, w, h, sprite, HPIncrease}){
        super({x, y, w, h, sprite});
        this.HPIncrease = HPIncrease;   // The amount of HP that will be added to a player total HP
        this.pickupSound = createSound(`${PATH_AUDIO}/Orbs/OrbOfHealthPickup.wav`);

    }

    // Player has collected the orb
    collect(){
        // Increase player maxHP
        PLAYER.maxHP = PLAYER.maxHP + this.HPIncrease;

        // Restore player current HP for the same amount
        PLAYER.currentHP = PLAYER.currentHP + this.HPIncrease;

        // Playing pickup sound
        this.pickupSound.play();

        // Remove the collected orb
        removeFromArray(ORBS, this);
    }
}