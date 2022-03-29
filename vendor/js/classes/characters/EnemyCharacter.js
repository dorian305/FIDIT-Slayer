import { Character } from "./Character.js";

/*
  Enemy characters class.
  Instantiating this class will create new enemy unit
	Inherits from character class.
*/
export class EnemyCharacter extends Character {
  constructor({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, spriteLength}){
    super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, spriteLength});
    this.isEnemy =                 true;                  // Used for determining whether a character is an enemy
    this.contactDamage =           15;                    // Damage amount upon touching an enemy
  }
}