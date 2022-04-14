import { Entity } from "./Entity.js";
/*
  Platforms in the game.
  Used as a ground for characters to walk on, as walls, and some can be destroyed using your weapon. 
  Causes collision!
*/
export class Platform extends Entity {
  constructor({x, y, w, h, sprite, visible, destroyable, HP, killOnTouch}){
		super({x, y, w, h, sprite, visible});
    
    // If platform can be destroyed, create additional properties
    if (destroyable){
      this.destroyable = destroyable;   // The platform can be destroyed
      this.HP =          HP;            // Platform's HP
    }

    // If platforms kill entity that touches it
    if (killOnTouch){
      this.killOnTouch = killOnTouch;;  // Kill any entity that touches the platform immediately
    }

    // Push platform into array of all platforms
    PLATFORMS.push(this);
  }

  /*
    Creating a rectangle shape from individual platforms.
    Height and width are defined by the number of units of ground platform.
    So rectangle with width: 5 and height: 5 is going to the the rectangle
    made of 5 units of ground platform along the X and 5 units along the Y axis.
  */
  static generateRectangle({x, y, w, h, sprite, visible, destroyable, HP, killOnTouch}) {
    new Platform({x: x,
      y: y,
      w: w,
      h: h,
      sprite: sprite,
      visible: visible,
      destroyable: destroyable,
      HP: HP,
      killOnTouch: killOnTouch,
    });
  }

  /*
    Creating left and right triangles from individual platforms.
		The triangles are built from the bottom up!
  */
  static generateTriangle({x, y, h, size, direction, sprite, visible, destroyOnTouch}){
    if (direction === "left"){
      // Generating left triangle
      for (let i = 0; i < h; i++){
        for (let j = 0; j < h; j++){
					if (i + j >= h - 1){
            new Platform({x: x + (i * size.w), y: y + (j * size.h), w: size.w, h: size.h, sprite: sprite, visible: visible, destroyOnTouch: destroyOnTouch});
					}
        }
      }
    }
    else if (direction === "right"){
      // Generating right triangle
      for (let i = 0; i < h; i++){
        for (let j = 0; j < h; j++){
					if (i <= j){
            new Platform({x: x + (i * size.w), y: y + (j * size.h), w: size.w, h: size.h, sprite: sprite, visible: visible, destroyOnTouch: destroyOnTouch});
					}
        }
      }
    }
  }
}