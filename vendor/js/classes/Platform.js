import { Entity } from "./Entity.js";
/*
  Platforms in the game.
  Used as a ground for characters to walk on, 
	and collision check is performed against platforms.
*/
export class Platform extends Entity {
  constructor({x, y, w, h, sprite, visible, destroyOnTouch}){
		super({x, y, w, h, sprite, visible});
		this.destroyOnTouch = destroyOnTouch;																		// The platform will be destroyed when touched
    PLATFORMS.push(this);
  }

  /*
    Generating left and right walls in the game.
    The left wall represents the beginning of the level,
    while the right wall represents the end of the level.
  */
  static createLeftWall({sprite}) {
		let LEFT_WALL = null;
    for (let i = 0; i < CANVAS.height / GROUND_PLATFORM_SIZE.h; i++){
      LEFT_WALL = new Platform({x: LEVEL_BEGINNING_EDGE, y: i * GROUND_PLATFORM_SIZE.h, w: GROUND_PLATFORM_SIZE.w, h: GROUND_PLATFORM_SIZE.h, sprite: sprite});
    }
		return LEFT_WALL;
  }
  static createRightWall({sprite}) {
		let RIGHT_WALL = null;
    for (let i = 0; i < CANVAS.height / GROUND_PLATFORM_SIZE.h; i++){
      RIGHT_WALL = new Platform({x: LEVEL_END_EDGE - GROUND_PLATFORM_SIZE.w, y: i * GROUND_PLATFORM_SIZE.h, w: GROUND_PLATFORM_SIZE.w, h: GROUND_PLATFORM_SIZE.h, sprite: sprite});
    }
    return RIGHT_WALL;
  }

  /*
    Creating a rectangle shape from individual platforms.
    Height and width are defined by the number of units of ground platform.
    So rectangle with width: 5 and height: 5 is going to the the rectangle
    made of 5 units of ground platform along the X and 5 units along the Y axis.
  */
  static generateRectangle({x, y, w, h, sprite, visible, destroyOnTouch}) {
    for (let i = 0; i < h; i++){
      for (let j = 0; j < w; j++){
        new Platform({x: x + (j * GROUND_PLATFORM_SIZE.w), y: y + (i * GROUND_PLATFORM_SIZE.h), w: GROUND_PLATFORM_SIZE.w, h: GROUND_PLATFORM_SIZE.h, sprite: sprite, visible: visible, destroyOnTouch: destroyOnTouch});
      }
    }
  }

  /*
    Creating left and right triangles from individual platforms.
		The triangles are built from the bottom up!
  */
  static generateTriangle({x, y, h, direction, sprite, visible, destroyOnTouch}){
    if (direction === "left"){
      // Generating left triangle
      for (let i = 0; i < h; i++){
        for (let j = 0; j < h; j++){
					if (i + j >= h - 1){
          new Platform({x: x + (i * GROUND_PLATFORM_SIZE.w), y: y + (j * GROUND_PLATFORM_SIZE.h), w: GROUND_PLATFORM_SIZE.w, h: GROUND_PLATFORM_SIZE.h, sprite: sprite, visible: visible, destroyOnTouch: destroyOnTouch});
					}
        }
      }
    }
    else if (direction === "right"){
      // Generating right triangle
      for (let i = 0; i < h; i++){
        for (let j = 0; j < h; j++){
					if (i <= j){
          new Platform({x: x + (i * GROUND_PLATFORM_SIZE.w), y: y + (j * GROUND_PLATFORM_SIZE.h), w: GROUND_PLATFORM_SIZE.w, h: GROUND_PLATFORM_SIZE.h, sprite: sprite, visible: visible, destroyOnTouch: destroyOnTouch});
					}
        }
      }
    }
  }
}