import { Character }  from "./Character.js";
import { Timer }      from "../Timer.js";
import { randomNumber } from "../../functions/randomnumber.js";
/*
  Enemy characters class.
  Instantiating this class will create new enemy unit
	Inherits from character class.
*/
export class EnemyCharacter extends Character {
    constructor({x, y, w, h, jumpHeight, jumps, enemyType, weapon, movespeed, seekingMovespeedFactor, HP, sprite, contactDamage, patrolDistance, attackCooldown, deathSound}){
      super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, weapon, deathSound});
      this.isEnemy =            true;                          // Used for determining whether a character is an enemy
      this.origin =             this.center.x;                   // The origin point from which the character patrols
      this.patrolDistance =     patrolDistance;                // The maximum distance an enemy will go on one side before moving to the other side
      this.patrolDistanceEdge = {                             // Left and right edges of the enemy patrol area
        left: this.origin - this.patrolDistance / 2,
        right: this.origin + this.patrolDistance / 2,
      }
      this.enemyType =          enemyType;                     // Type of the enemy (Ranged, melee)
      this.contactDamage =      contactDamage;                 // Damage amount upon touching an enemy
      this.attackCooldown =     attackCooldown;                // Amount of time enemy will wait between attacks in milliseconds
      this.chaseDuration =      3000;                          // Amount of time enemy will stop chasing after you and go back to its origin point
      this.allowAttack =        true;                          // Flag to determine whether the character is allowed to perform an attack
      this.seekingMovespeedFactor = seekingMovespeedFactor;    // The speed factor increase at which the melee enemy will seek player

      ENEMIES.push(this);
    }

    // Enemy melee patrol
    meleePatrol() {
      // Check if player character is within enemy patrol area. If it is, attack it
      if (
          PLAYER.right >= this.patrolDistanceEdge.left &&
          PLAYER.left <= this.patrolDistanceEdge.right &&
          PLAYER.bottom >= this.top &&
          PLAYER.top <= this.bottom &&
          this.allowAttack
        ){
        this.meleeAttack();
      }
      else if (this.direction.right){
        // If the enemy has reached the rightmost patrol edge, start moving to the left side
        if (this.right >= this.patrolDistanceEdge.right){
          this.velocity.x = -this.movespeed;
        }
        else {
          this.velocity.x = this.movespeed;
        }
      }
      else if (this.direction.left){
        // If the enemy has reached the leftmost patrol edge, start moving to the right side
        if (this.left <= this.patrolDistanceEdge.left){
          this.velocity.x = this.movespeed;
        }
        else {
          this.velocity.x = -this.movespeed;
        } 
      }
    }

    // Enemy range patrol
    rangePatrol() {
      if (
          PLAYER.right >= this.patrolDistanceEdge.left &&
          PLAYER.left <= this.patrolDistanceEdge.right &&
          PLAYER.bottom >= this.top - 100 &&
          PLAYER.top <= this.bottom + 100 &&
          this.allowAttack
      ){
        this.rangedAttack();
        this.allowAttack = false;
        const timer = new Timer(() => this.allowAttack = true, this.attackCooldown * randomNumber(1, 2));
        timer.start();

        // 50% chance for the enemy to jump
        if (randomNumber(1, 10) > 5){
          this.jump();
        }
      }
    }

    // Enemy melee attack
    meleeAttack() {
      // Check if the enemy collided with a player
      if (this.checkCollision(PLAYER)){
        this.allowAttack = false; // disable attacking until the cooldown expires
        // Wait until attack cooldown expires to perform another attack
        const timer = new Timer(() => this.allowAttack = true, this.attackCooldown);
        timer.start();
      }
      // Attack the player
      else {
        if (PLAYER.center.x < this.center.x){
          this.velocity.x = -this.movespeed * this.seekingMovespeedFactor;
        }
        else if (PLAYER.center.x > this.center.x){
          this.velocity.x = this.movespeed * this.seekingMovespeedFactor;
        }
      }
    }

    // Ranged attack (shooting)
    rangedAttack() {
      if (PLAYER.center.x < this.center.x){
        this.direction.left = true;
        this.direction.right = false;
      }
      else if (PLAYER.center.x > this.center.x){
        this.direction.right = true;
        this.direction.left = false;
      }
      this.attack();
    }
}