import { Entity } from "./Entity.js";
/*
	Generic object class.
	Instantiate GenericObject when you want to create elements such as background,
	and background elements such as clouds or similar objects that the player character will
	not be able to interact with.
*/
export class GenericObject extends Entity {
	constructor({x, y, w, h, sprite}){
		super({x, y, w, h, sprite});
			GENERIC_OBJECTS.push(this);
	}
}