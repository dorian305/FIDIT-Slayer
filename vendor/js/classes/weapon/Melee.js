import { Weapon } from "../Weapon.js"

export class Melee extends Weapon {
  constructor({damage, attackInterval, weaponName, attackSound}){
    super({damage, attackInterval, weaponName, attackSound});
    // this.isOnFire = isOnFire;        // Checks whether weapon "is on fire" (beast mode)
  }

  attack(){
    
  }
  
}