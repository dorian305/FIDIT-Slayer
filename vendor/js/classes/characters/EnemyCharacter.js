import { Character }  from "./Character.js";
import { Timer }      from "../Timer.js";
/*
  Enemy characters class.
  Instantiating this class will create new enemy unit
	Inherits from character class.
*/
export class EnemyCharacter extends Character {
    constructor({x, y, w, h, jumpHeight, jumps, weapon, movespeed, HP, sprite, contactDamage, patrolDistance, attackCooldown}){
      super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, weapon});
      this.isEnemy =            true;                          // Used for determining whether a character is an enemy
      this.patrolDistance =     patrolDistance;                // The maximum distance an enemy will go on one side before moving to the other side
      this.origin =             this.left + this.size.w / 2;   // The origin point from which the character patrols
      this.contactDamage =      contactDamage;                 // Damage amount upon touching an enemy
      this.attackCooldown =     attackCooldown;                // Amount of time enemy will wait between attacks in milliseconds
      this.chaseDuration =      3000;                          // Amount of time enemy will stop chasing after you and go back to its origin point
      this.allowAttack =        true;                          // Flag to determine whether the character is allowed to perform an attack
      ENEMIES.push(this);
    }

    // Enemy patrol
    patrol() {
      // Check if player character is within enemy patrol area. If it is, attack it
      if (
          PLAYER.position.x + PLAYER.size.w >= this.origin - this.patrolDistance &&
          PLAYER.position.x <= this.origin + this.patrolDistance &&
          PLAYER.position.y + PLAYER.size.h >= this.position.y &&
          PLAYER.position.y <= this.position.y + this.size.h &&
          this.allowAttack
        ){
        this.attack();
      }
      else if (this.direction.right){
        // If the enemy has reached the rightmost patrol edge, start moving to the left side
        if (this.position.x >= this.origin + this.patrolDistance){
          this.velocity.x = -this.movespeed;
        }
        else {
          this.velocity.x = this.movespeed;
        }
      }
      else if (this.direction.left){
        // If the enemy has reached the leftmost patrol edge, start moving to the right side
        if (this.position.x <= this.origin - this.patrolDistance){
          this.velocity.x = this.movespeed;
        }
        else {
          this.velocity.x = -this.movespeed;
        } 
      }
    }

    // Enemy attack
    attack() {
      if (this.checkCollision(PLAYER)){
        this.allowAttack = false;
        const timer = new Timer(() => this.allowAttack = true, this.attackCooldown);
        timer.start();
      }
      else {
        if (PLAYER.position.x <= this.position.x){
          this.velocity.x = -this.movespeed * 2;
        }
        else if (PLAYER.position.x >= this.position.x){
          this.velocity.x = this.movespeed * 2;
        }
      }
    }
}