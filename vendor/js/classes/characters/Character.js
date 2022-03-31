import { Entity }           from "../Entity.js";
import { Graphics }         from "../Graphics.js";
import { createSound }      from "../../functions/createsound.js";
import { removeFromArray }  from "../../functions/removefromarray.js";
import { Bullet }           from "../Bullet.js";

/*
  Abstract class Character which contains properties
  and methods which are shared by all other characters.
	It inherits from Entity class.
*/
export class Character extends Entity {
  constructor({x, y, w, h, sprite, movespeed, HP, jumpHeight, jumps, attackDamage}){
		super({x, y, w, h, sprite});												 // Calling constructor from the extended class Entity
    if (this.constructor === Character){
      throw new Error(`Cannot instantiate an abstract class "Character"!`);
    }
    this.movespeed =      movespeed;                     // How fast is the character moving (Velocity on the X axis)
    this.maxHP =          HP;                            // Max HP of a character
		this.currentHP = 			this.maxHP;										 // Current HP of a character
    this.isDead =         false;                         // Flag tracking whether character died in any way
		this.jumpHeight =     jumpHeight;                    // How high the character can jump
    this.jumps =          jumps;                         // How many times can character jump in a row
    this.remainingJumps = this.jumps;                    // Remaining jumps
    this.isCrouching =    false;                         // Flag tracking whether character is crouching
    this.damaged =        false;                         // Character can be damaged only when this is false
    this.attackDamage =   attackDamage;                  // How much damage character's attack deal
    this.direction =      "right";                       // Keeps track of the direction the character is facing
    this.lastDirection =  this.direction;                // Keeps track of the last direction the character was facing
    this.jumpSound =      createSound(`${PATH_AUDIO}/sounds/jump.mp3`);
  }

  /*
    Every character has the ability to perform an attack.
  */
  attack() {
    let bulletXPos =      0;
    let bulletYPos =      0;
    let bulletXVelocity = 0;
    let bulletYVelocity = 0;
    let bulletSprite =    "";

    // Determine which way the bullet is moving depending on the character direction
    if (this.direction === "left"){
      bulletXPos = this.left - 40;
      bulletYPos = this.top + 40;
      bulletXVelocity = -10;
      bulletYVelocity = 0;
      bulletSprite = `${PATH_SPRITES}/weapons/ranged/bulletleft.png`
    }
    else if (this.direction === "right"){
      bulletXPos = this.right + 20;
      bulletYPos = this.top + 40;
      bulletXVelocity = 10;
      bulletYVelocity = 0;
      bulletSprite = `${PATH_SPRITES}/weapons/ranged/bulletright.png`
    }
    else if (this.direction === "up" && this.lastDirection === "left"){
      bulletXPos = this.left - 40;
      bulletYPos = this.top;
      bulletXVelocity = 0;
      bulletYVelocity = -10;
      bulletSprite = `${PATH_SPRITES}/weapons/ranged/bulletup.png`
    }
    else if (this.direction === "up" && this.lastDirection === "right"){
      bulletXPos = this.right + 20;
      bulletYPos = this.top;
      bulletXVelocity = 0;
      bulletYVelocity = -10;
      bulletSprite = `${PATH_SPRITES}/weapons/ranged/bulletup.png`
    }

    // Creating the bullet
    const bullet = new Bullet({x: bulletXPos, y: bulletYPos, w: 20, h: 20, sprite: {default: bulletSprite}, damage: this.attackDamage});
    bullet.velocity.x = bulletXVelocity;
    bullet.velocity.y = bulletYVelocity;
  }

  /*
    Characters can jump while not crouching and has jump count left.
    The additional jumps can only be initiated while the character's Y velocity is positive.
    So, if a character has started falling down (meaning the movement is downwards,
    another jump can't be initiated).
  */
  jump() {
    if (!this.isCrouching && this.remainingJumps > 0 && this.velocity.y <= 3){
      this.velocity.y =       0;                                     // Reset Y velocity whenever new jump is initiated (allows clean jump)
      this.velocity.y =       this.velocity.y - this.jumpHeight;     // Move character upwards
      if (!DEBUG_MODE){
        this.remainingJumps =   this.remainingJumps - 1;             // Reduce remaining jumps on each jump
      }
      this.jumpSound.play();
    }
    /* */
  }

  /*
    Collision detection for each character
  */
  collider2D(){
    // Collision with platforms
    PLATFORMS.forEach(platform => {
      /*
        Check if character is colliding with any platform.
        If it isn't, skip to the next platform.
      */
			if (!this.checkCollision(platform)) return;

      /*
        If player has collided with a platform that gets destroyed on touch,
        remove the platform.
      */
      if (this === PLAYER && platform.destroyOnTouch){
        removeFromArray(PLATFORMS, this);
        return;
      }

      /*
        Detect from which side the collision occured.
      */
      if (this.bottom + this.velocity.y > platform.top && this.oldBottom < platform.oldTop){
        // The collision has occured from the bottom (character has landed on a platform).
        this.position.y =           (platform.top - this.size.h) - 0.1;
        this.velocity.y =           platform.velocity.y;
        this.remainingJumps =       this.jumps;
				// If the platform is invisible and player landed on it, set it to be visible
				if (platform.visible === false) platform.visible = true;
        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE)
          Graphics.drawLine({x1: 0, y1: this.position.y + this.size.h, x2: CANVAS.width, y2: this.position.y + this.size.h, thickness: 1, color: 'red'});
        } 
      
      else if (this.top + this.velocity.y < platform.bottom && this.oldTop > platform.oldBottom){
        // The collision has occured from the top (character has bumped into the platform from below).
        this.position.y =           platform.bottom + 0.1;
        this.velocity.y =          -this.velocity.y;
        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE)
          Graphics.drawLine({x1: 0, y1: this.position.y, x2: CANVAS.width, y2: this.position.y, thickness: 1, color: 'red'});
        } 
      
      else if (this.right + this.velocity.x > platform.left && this.oldRight < platform.oldLeft){
        // The collision has occured from the right.
        this.position.x =            (platform.left - this.size.w) - 0.1;
        this.velocity.x =            platform.velocity.x;
        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE)
          Graphics.drawLine({x1: this.position.x + this.size.w, y1: 0, x2: this.position.x + this.size.w, y2: CANVAS.height, thickness: 1, color: 'red'});
        
      } 
      
      else if (this.left + this.velocity.x < platform.right && this.oldLeft > platform.oldRight){
        // The collision has occured from the left.
        this.position.x =             platform.right + 0.1;
        this.velocity.x =             platform.velocity.x;
        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          Graphics.drawLine({x1: this.position.x, y1: 0, x2: this.position.x, y2: CANVAS.height, thickness: 1, color: 'red'});
        }
      }
    });

    // Collision with an enemy character if this === PLAYER
    if (this === PLAYER && !this.damaged){
      ENEMIES.forEach(enemy => {
        if (this.checkCollision(enemy)){
          this.damaged = 				true;
          this.currentHP = 			this.currentHP - enemy.contactDamage;
          if (this.currentHP < 0){
            this.currentHP = 			0;
            this.isDead = 				true
          }
          setTimeout(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
        }
      });
    }

    // Collision with an orb collectible
    if (this === PLAYER){
      ORBS.forEach(orb => {
        if (this.checkCollision(orb)){
          orb.checkCollected();
        }
      });
    }

    // Collision with bullets
    BULLETS.forEach(bullet => {
      if (this.checkCollision(bullet)){
          /*
            Check if the bullet damage is greater than currenHP.
            If it is, set damage equal to currentHP.
          */
          if (this.currentHP - bullet.damage < 0){
            bullet.damage = this.currentHP;
          }
          this.currentHP = this.currentHP - bullet.damage;
          removeFromArray(BULLETS, bullet);
          return;
      }
    });
  }

  /*
    Drawing HP bar above the character.
    HP bar consists of HP shell and remaining HP which is reduced from left to right.
  */
 drawHPBar() {
    // Common
    const HPOffsetFromTop = 		10;

    // HP Shell properties
    const HPShellBorderSize = 	2;
    const HPShellBorderColor =  "#d7d7d7";
    const HPShellWidth = 				(this.size.w * 2) - (HPShellBorderSize * 2);
    const HPShellHeight = 			15 - (HPShellBorderSize * 2);
    const HPShellColor = 				"#262626";
    const HPShellPositionX = 		this.left - (this.size.w / 2) + HPShellBorderSize;
    const HPShellPositionY = 		this.top - HPOffsetFromTop - HPShellHeight;

    // HP Bar properties
    const HPScale = 						HPShellWidth / this.maxHP;
    const HPBarWidth = 					this.currentHP * HPScale;
    const HPBarHeight = 				HPShellHeight;
    const HPBarColors = 				{healthy: "#09de25", weakened: "#deb009", critical: "#de1709"};
    let 	HPBarColor = 					null;
    const HPBarPositionX = 			HPShellPositionX;
    const HPBarPositionY = 			HPShellPositionY;

    // Determining HP bar color based on current health percentage
    const HPRatio = HPBarWidth / HPShellWidth;
    if (HPRatio > 0.66 && HPRatio <= 1){
      HPBarColor = HPBarColors.healthy;					// Heath percentage is in healthy range
    }
    else if (HPRatio > 0.33 && HPRatio < 0.66){
      HPBarColor = HPBarColors.weakened;				// Heath percentage is in weakened range
    }
    else {
      HPBarColor = HPBarColors.critical;				// Heath percentage is in critical range
    }
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY, thickness: HPShellBorderSize, color: HPShellBorderColor});      // Top border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Left border
    Graphics.drawLine({x1: HPShellPositionX + HPShellWidth, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Right border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY + HPShellHeight, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});    // Bottom border
    Graphics.drawRectangle({x: HPShellPositionX, y: HPShellPositionY, w: HPShellWidth, h: HPShellHeight, color: HPShellColor}); // Drawing HP Shell
    Graphics.drawRectangle({x: HPBarPositionX, y: HPBarPositionY, w: HPBarWidth, h: HPBarHeight, color: HPBarColor});           // Drawing HP Bar
 }

  // Draws the character and their HP bars
  draw() {
    CTX.drawImage(
      this.currentSprite,
      this.currentSpriteFrame * this.spriteFrameWidth,
      0,
      this.size.w,
      this.size.h,
      this.position.x,
      this.position.y,
      this.size.w,
      this.size.h
    );
    this.drawHPBar();
  }

  // Updating character properties
  update(){
    /*
      Every game character is under the influence of gravity.
      So, if a character is in the air, meaning if its bottom side is NOT
      on some kind of platform, then apply the gravity effect.
    */
    if (this.top < CANVAS.height){
      // Increase character velocity Y by GRAVITY amount
      this.velocity.y = this.velocity.y + GRAVITY;
    }
    /*
      The character top side is less than the canvas height.
      Character has died and the.
    */
    else {
      this.currentHP = 0;
    }

    /*
    Checking whether the character current HP is 0.
    If it is, the character is dead, remove it from the array.
    */
    if (this.currentHP <= 0){
      this.isDead = true;
      if (this !== PLAYER){
        removeFromArray(ENEMIES, this);
      }
    }

    // Perform collision detection for each character
    this.collider2D();

    /*
      Updating character sprite to match the character's current direction.
      If it's moving leftwards, then change the sprite to be facing left.
      Same for other directions.
    */
    if (this.direction === "left"){
      this.currentSprite.src = this.sprite.stand.left;
    }
    else if (this.direction === "right"){
      this.currentSprite.src = this.sprite.stand.right;
    }
    
    /*
      Updating character old sides coordinates to current sides coordinates,
      then updating character coordinates, and finally updating current sides coordinates
      to new character coordinates
    */
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