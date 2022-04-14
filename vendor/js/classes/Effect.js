import { Entity } from "./Entity.js";
import { removeFromArray } from "../functions/removefromarray.js";
/*
    Effect class. Creates an object which represents an effect, such as explosion,
    dust or other. Upon sprite animation finish, the object is destroyed.
*/
export class Effect extends Entity {
    constructor({x, y, w, h, sprite}){
        super({x, y, w, h, sprite});
        EFFECTS.push(this);
    }

    updateSprite(){
		if (this.currentSpriteFrame >= this.spriteLength - 1){
			this.currentSpriteFrame = 0;
            removeFromArray(EFFECTS, this);
		} else {
			this.currentSpriteFrame = this.currentSpriteFrame + 1;
		}
	}
}