import { Entity }               from './Entity.js';
import { removeFromArray }      from '../functions/removefromarray.js';
/*
    Fireballs are entities in level which cause lethal damage when in contact with.
*/
export class Fireball extends Entity {
    constructor({x, y, w, h, sprite}){
        super({x, y, w, h, sprite});
        FIREBALLS.push(this);
    }

    update(){
        if (this.top < CANVAS.height){
            this.velocity.y = this.velocity.y + GRAVITY;
        }
        else {
            removeFromArray(FIREBALLS, this);
        }

        if (this.velocity.y <= 0){
            this.currentSprite.src = this.sprite.up;
        }
        else {
            this.currentSprite.src = this.sprite.down;
        }
        this.updateSprite();
        
        this.oldLeft =          this.left;
        this.oldRight =         this.right;
        this.position.x =       this.position.x + this.velocity.x;
        this.left =             this.position.x;
        this.right =            this.position.x + this.size.w;
        this.oldTop =           this.top;
        this.oldBottom =        this.bottom;
        this.position.y =       this.position.y + this.velocity.y;
        this.top =              this.position.y;
        this.bottom =           this.position.y + this.size.h;

        // Draw character at new coordinates
        this.draw();
  }
}