import { Entity }   from "../Entity.js";

export class Orb extends Entity {
    constructor({x, y, w, h, sprite}){
        super({x, y, w, h, sprite});
        if (this.constructor === Orb){
            throw new Error(`Cannot instantiate an abstract class "Orb"!`);
        }
        ORBS.push(this);
    }
}