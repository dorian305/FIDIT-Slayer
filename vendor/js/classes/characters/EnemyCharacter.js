import { Character } from "./Character.js";

/*
  Enemy characters class.
  Instantiating this class will create new enemy unit
	Inherits from character class.
*/
export class EnemyCharacter extends Character {
    constructor({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, contactDamage, attackDamage, patrolArea}){
      super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, attackDamage});
      this.isEnemy =       true;              // Used for determining whether a character is an enemy
      this.patrolArea =    patrolArea;        // The area that the enemy will be patrolling
      this.origin =        this.position.x;   // The origin point from which the patrolling will happen
      this.contactDamage = contactDamage;     // Damage amount upon touching an enemy
      ENEMIES.push(this);
    }
}