import { createSound } from "../../functions/createsound.js"; 

export class Weapon {
  constructor({damage, attackInterval, weaponName, attackSound}){
    if (this.constructor === Weapon){
      throw new Error('Cannot instantiate an abstract class "Weapon"!');
    }
    this.damage =              damage;                      // The damage that the weapon deals
    this.attackInterval =      attackInterval;              // The interval/duration of attack
    // this.weaponName =          "Default";                   // The name of the weapon 
    this.attackSound =         createSound(attackSound);    // The sound that the weapon makes upon attack
  }

  
  
}