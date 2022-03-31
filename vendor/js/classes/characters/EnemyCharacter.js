import { Character } from "./Character.js";

/*
  Enemy characters class.
  Instantiating this class will create new enemy unit
	Inherits from character class.
*/
export class EnemyCharacter extends Character {
    constructor({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, contactDamage, attackDamage}){
      super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, attackDamage});
      this.isEnemy =                 true;                  // Used for determining whether a character is an enemy
      this.contactDamage =           contactDamage;         // Damage amount upon touching an enemy
      ENEMIES.push(this);
    }
}