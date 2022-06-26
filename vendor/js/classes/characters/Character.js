import { Entity }           from "../Entity.js";
import { Graphics }         from "../Graphics.js";
import { removeFromArray }  from "../../functions/removefromarray.js";
import { stopSound }        from "../../functions/stopsound.js";
import { randomNumber }     from "../../functions/randomnumber.js";
import { Timer }            from "../Timer.js";

/*
  Abstract class Character which contains properties
  and methods which are shared by all other characters.
	It inherits from Entity class.
*/
export class Character extends Entity {
  constructor({x, y, w, h, crouch_height, sprite, movespeed, HP, jumpHeight, jumps, weapon}){
    super({x, y, w, h, sprite});												 // Calling constructor from the extended class Entity
    if (this.constructor === Character){
      throw new Error(`Cannot instantiate an abstract class "Character"!`);
    }
    this.movespeed =      movespeed;                     // How fast is the character moving (Velocity on the X axis)
    this.maxHP =          HP;                            // Max HP of a character
		this.currentHP = 			this.maxHP;										 // Current HP of a character
    this.isDead =         false;                         // Flag tracking whether character died in any way
    this.crouch_height =  crouch_height;                 // Height of the character while crouching
		this.jumpHeight =     jumpHeight;                    // How high the character can jump
    this.jumps =          jumps;                         // How many times can character jump in a row
    this.remainingJumps = this.jumps;                    // Remaining jumps
    this.isCrouching =    false;                         // Flag tracking whether character is crouching
    this.isGrounded =     false;                         // Flag tracking whether character is grounded
    this.damaged =        false;                         // Character can be damaged only when this is false
    this.weapon =         weapon;                        // Character's weapon
    this.currentState =   "idle";                        // Character's current animation state
    this.direction = {
      up:     false,
      left:   false,
      right:  true,
    }
  }

  /*
    Every character has the ability to perform an attack.
  */
  attack() {
    // If character owns weapon, fire from a weapon.
    if (this.weapon){
      let missileSprite =    "";
      let missilePosition =  {x: 0, y: 0};
      let missileVelocity =  {x: 0, y: 0};
      let missileSize =      {w: 0, h: 0};
      let missileOwner =     this;

      // Determine which way the missile is moving depending on the character direction
      if (this.direction.up && this.direction.left){
          missilePosition.x =   this.left - this.weapon.missileSize.w - 10;
          missilePosition.y =   this.top - this.weapon.missileSize.h + 60;
          missileVelocity.x =   0;
          missileVelocity.y =  -this.weapon.missileSpeed;
          missileSize =         {w: this.weapon.missileSize.h, h: this.weapon.missileSize.w};
          missileSprite =       this.weapon.missileSprite.up;
      }
      else if (this.direction.up && this.direction.right){
          missilePosition.x =   this.right + 10;
          missilePosition.y =   this.top - this.weapon.missileSize.h + 60;
          missileVelocity.x =   0;
          missileVelocity.y =  -this.weapon.missileSpeed;
          missileSize =         {w: this.weapon.missileSize.h, h: this.weapon.missileSize.w};
          missileSprite =       this.weapon.missileSprite.up;
      }
      else if (this.direction.left){
          missilePosition.x =   this.left - this.weapon.missileSize.w;
          missilePosition.y =   this.top - this.weapon.missileSize.h + 60;
          missileVelocity.x =  -this.weapon.missileSpeed;
          missileVelocity.y =   0;
          missileSize =         {w: this.weapon.missileSize.w, h: this.weapon.missileSize.h};
          missileSprite =       this.weapon.missileSprite.left;
          }
      else if (this.direction.right){
          missilePosition.x =   this.right + 10;
          missilePosition.y =   this.top - this.weapon.missileSize.h + 60;
          missileVelocity.x =   this.weapon.missileSpeed;
          missileVelocity.y =   0;
          missileSize =         {w: this.weapon.missileSize.w, h: this.weapon.missileSize.h};
          missileSprite =       this.weapon.missileSprite.right;
      }
      this.weapon.attack({missileSprite, missilePosition, missileVelocity, missileSize, missileOwner});
    }
  }

  /*
    Characters can jump while not crouching and have jump count left.
    The additional jumps can only be initiated while the character's Y velocity is positive.
    So, if a character has started falling down (meaning the movement is downwards,
    another jump can't be initiated).
  */
  jump() {
    if (!this.isCrouching && this.remainingJumps > 0 && this.velocity.y <= 3){
      this.isGrounded =       false;                                 // Character isn't grounded if it jumped.
      this.velocity.y =       0;                                     // Reset Y velocity whenever new jump is initiated (allows clean jump)
      this.velocity.y =       this.velocity.y - this.jumpHeight;     // Move character upwards
      if (!DEBUG_MODE){
        this.remainingJumps =   this.remainingJumps - 1;             // Reduce remaining jumps on each jump
      }
      
      /*
        Playing player character jumping sound effect.
        There are 2 jumping sound effects, which are played at random.
      */
      if (this === PLAYER){

        /*
          Stop any already playing jumping sound before playing it again.
        */
        stopSound(this.jumpSound1);
        stopSound(this.jumpSound2);
        randomNumber(1, 2) === 1 ? this.jumpSound1.play() : this.jumpSound2.play();
      }
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
        Check whether the character has collided with a deadly platform.
        If it has, kill it instantly.
      */
      if (platform.killOnTouch){
        this.currentHP = 0;
      }

      /*
        Detecting from which side the collision has occured. The reference is character.
      */
      // Check if the collision occured from the bottom side (landing on the platform).
      else if (this.oldBottom < platform.oldTop){
        this.position.y =     platform.top - this.size.h - 0.1;
        this.velocity.y =     platform.velocity.y;
        this.remainingJumps = this.jumps;
        this.isGrounded =     true;
        
        // If the platform is invisible and player landed on it, set it to be visible
        if (platform.visible === false){
          platform.visible = true;
        }

        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          Graphics.drawLine({x1: 0, y1: this.position.y + this.size.h, x2: CANVAS.width, y2: this.position.y + this.size.h, thickness: 1, color: 'red'});
        }
      }

     // Check if collision occured from the left side.
     else if (this.oldLeft > platform.oldRight){
       // Platforms which become visible once you land on them do not cause collision from left side
       if (platform.visible !== false){
         this.position.x = platform.right + 0.1;
         this.velocity.x = platform.velocity.x;
       }
      
        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          Graphics.drawLine({x1: this.position.x, y1: 0, x2: this.position.x, y2: CANVAS.height, thickness: 1, color: 'red'});
        }
      }

      // Check if collision occured from the right side.
      else if (this.oldRight < platform.oldLeft){
        // Platforms which become visible once you land on them do not cause collision from right side
        if (platform.visible !== false){
          this.position.x = platform.left - this.size.w - 0.1;
          this.velocity.x = platform.velocity.x;
        }

        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          Graphics.drawLine({x1: this.position.x + this.size.w, y1: 0, x2: this.position.x + this.size.w, y2: CANVAS.height, thickness: 1, color: 'red'});
        }
      }

      // Check if collision occured from the top side (bumping into the platform from below).
      else if (this.oldTop > platform.oldBottom){
        // Platforms which become visible once you land on them do not cause collision from below
        if (platform.visible !== false){
          this.position.y = platform.bottom + 0.1;
          this.velocity.y = -this.velocity.y;
        }

        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          Graphics.drawLine({x1: 0, y1: this.position.y, x2: CANVAS.width, y2: this.position.y, thickness: 1, color: 'red'});
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
            this.currentHP = 		0;
          }

          // When the player gets damaged, give PLAYER_DAMAGED_DELAY time before allowing another damage.
          const timer = new Timer(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
          timer.start();
        }
      });
    }

    // Collision with an orb collectible
    if (this === PLAYER){
      ORBS.forEach(orb => {
        if (this.checkCollision(orb)){
          orb.collect();
        }
      });
    }

    // Collision with missiles
    MISSILES.forEach(missile => {
      if (this.checkCollision(missile) && this !== missile.owner){
          /*
            Check if the missile damage is greater than currentHP.
            If it is, set damage equal to currentHP.
          */
          if (this.currentHP - missile.damage < 0){
            missile.damage = this.currentHP;
          }
          this.currentHP = this.currentHP - missile.damage;
          removeFromArray(MISSILES, missile);
      }
    });

    // Collision with Fireballs
    FIREBALLS.forEach(fireball => {
      if (this.checkCollision(fireball)){
        this.currentHP = 0;
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
      on some kind of platform (isn't grounded), then apply the gravity effect.
    */
    if (this.top < CANVAS.height){
      this.velocity.y = this.velocity.y + GRAVITY;          // Increase character velocity Y by GRAVITY amount
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

    /*
      Checking if character is crouching
    */
   if (this.isCrouching){
     this.size.h = this.crouch_height;
     this.isGrounded = false;
   }
   else {
     this.size.h = PLAYER_SIZE.h;
   }

    // Perform collision detection for each character
    this.collider2D();

    /*
      Updating character's facing direction depending on its X velocity.
      If it's negative, character is facing left. Otherwise character is facing right.
    */
    if (this.velocity.x < 0 && !this.direction.left){
      this.direction.left = true;
      this.direction.right = false;
    }
    else if (this.velocity.x > 0 && !this.direction.right){
      this.direction.right = true;
      this.direction.left = false;
    }

    /*
      Updating character's sprites.
    */
    if (this.direction.left){
      if (this.sprite.crouch && this.isCrouching){
        this.currentSprite.src = this.sprite.crouch.left;
        this.currentState = "crouchingleft";
      }
      else if (this.sprite.jump && this.velocity.y < 0 && !this.isGrounded){
        this.currentSprite.src = this.sprite.jump.left;
        this.currentState = "jumpingleft";
      }
      else if (this.sprite.fall && this.velocity.y > 0 && !this.isGrounded){
        this.currentSprite.src = this.sprite.fall.left;
        this.currentState = "fallingleft";
      }
      else if (this.sprite.idle && this.velocity.x == 0){
        this.currentSprite.src = this.sprite.idle.left;
        this.currentState = "idleleft";
      }
      else if (this.sprite.move && this.velocity.x != 0 && this.currentState != "moveleft"){
        this.currentSprite.src = this.sprite.move.left;
        this.currentState = "moveleft";
      }
    }
    else if (this.direction.right){
      if (this.sprite.crouch && this.isCrouching){
        this.currentSprite.src = this.sprite.crouch.right;
        this.currentState = "crouchingright";
      }
      else if (this.sprite.jump && this.velocity.y < 0 && !this.isGrounded){
        this.currentSprite.src = this.sprite.jump.right;
        this.currentState = "jumpingright";
      }
      else if (this.sprite.fall && this.velocity.y > 0 && !this.isGrounded){
        this.currentSprite.src = this.sprite.fall.right;
        this.currentState = "fallingright";
      }
      else if (this.sprite.idle && this.velocity.x == 0){
        this.currentSprite.src = this.sprite.idle.right;
        this.currentState = "idleright";
      }
      else if (this.sprite.move && this.velocity.x != 0 && this.currentState != "moveright"){
        this.currentSprite.src = this.sprite.move.right;
        this.currentState = "moveright";
      }
    }
    this.updateSpriteFrame();

    /*
      Perform these operations only if the character is an enemy.
    */
    if (this.isEnemy){
      // Only meele enemies patrol
      if (this.enemyType === "meele"){
        this.meelePatrol();
      }
      // Ranged enemies patrol
      else if (this.enemyType === "range") {
        this.rangePatrol();
      }
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
    this.center = 				  this.left + this.size.w / 2;

    // Draw character at new coordinates
    this.draw();
  }
}