import { Character }  from "./Character.js";

export class EnemyBoss extends Character {
    constructor({x, y, w, h, jumpHeight, jumps, enemyType, movespeed, weapon, HP, sprite, attackCooldown, healthUI}){
        super({x, y, w, h, jumpHeight, jumps, weapon, HP, sprite});
        this.isEnemy = true;
        this.enemyType = enemyType;
        this.attackCooldown = attackCooldown;
        this.healthUI = healthUI;

        ENEMIES.push(this);
    }
}