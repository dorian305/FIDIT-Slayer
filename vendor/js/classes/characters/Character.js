import { Entity }           from "../Entity.js";
import { Effect }           from "../Effect.js";
import { Graphics }         from "../Graphics.js";
import { removeFromArray }  from "../../functions/removefromarray.js";
import { stopSound }        from "../../functions/stopsound.js";
import { createSound } 		  from "../../functions/createsound.js";
import { randomNumber }     from "../../functions/randomnumber.js";
import { Timer }            from "../Timer.js";

/*
  Abstract class Character which contains properties
  and methods which are shared by all other characters.
	It inherits from Entity class.
*/
export class Character extends Entity {
  constructor({x, y, w, h, crouchHeight, sprite, movespeed, HP, jumpHeight, jumps, weapon, deathSound}){
    super({x, y, w, h, sprite});												 // Calling constructor from the extended class Entity
    if (this.constructor === Character){
      throw new Error(`Cannot instantiate an abstract class "Character"!`);
    }
    this.movespeed =      movespeed;                     // How fast is the character moving (Velocity on the X axis)
    this.maxHP =          HP;                            // Max HP of a character
		this.currentHP = 			this.maxHP;										 // Current HP of a character
    this.isDead =         false;                         // Flag tracking whether character died in any way
    this.originalHeight = this.size.h;                   // Original height of the character
    this.crouchHeight =   crouchHeight;                  // Height of the character while crouching
		this.jumpHeight =     jumpHeight;                    // How high the character can jump
    this.jumps =          jumps;                         // How many times can character jump in a row
    this.remainingJumps = this.jumps;                    // Remaining jumps
    this.isCrouching =    false;                         // Flag tracking whether character is crouching
    this.isGrounded =     false;                         // Flag tracking whether character is grounded
    this.damaged =        false;                         // Character can be damaged only when this is false
    this.weapon =         weapon;                        // Character's weapon
    this.currentState =   "idle";                        // Character's current animation state
    this.deathSound =     deathSound;                    // The sound of character's death
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
      let missileFireEffectSprite = "";
      let missilePosition =  {x: 0, y: 0};
      let missileVelocity =  {x: 0, y: 0};
      let missileSize =      {w: 0, h: 0};
      let missileOwner =     this;

      /*
        Determine which way the missile is moving depending on the character direction
      */
      if (this.direction.up && this.direction.left){
          missilePosition.x =   this.left - this.weapon.missileSize.w / 2;
          missilePosition.y =   this.top + this.size.h / 2 + this.weapon.missileSize.h / 2;
          missileVelocity.x =   0;
          missileVelocity.y =  -this.weapon.missileSpeed;
          missileSize =         {w: this.weapon.missileSize.h, h: this.weapon.missileSize.w};
          missileSprite =       this.weapon.missileSprite.up;
          missileFireEffectSprite = this.weapon.missileSprite.fire.left;
      }
      else if (this.direction.up && this.direction.right){
          missilePosition.x =   this.right + this.weapon.missileSize.w / 2;
          missilePosition.y =   this.top + this.size.h / 2 + this.weapon.missileSize.h / 2;
          missileVelocity.x =   0;
          missileVelocity.y =  -this.weapon.missileSpeed;
          missileSize =         {w: this.weapon.missileSize.h, h: this.weapon.missileSize.w};
          missileSprite =       this.weapon.missileSprite.up;
          missileFireEffectSprite = this.weapon.missileSprite.fire.right;
      }
      else if (this.direction.left){
          missilePosition.x =   this.left + this.weapon.missileSize.w / 2;
          missilePosition.y =   this.top + this.size.h / 2 + this.weapon.missileSize.h / 2;
          missileVelocity.x =  -this.weapon.missileSpeed;
          missileVelocity.y =   0;
          missileSize =         {w: this.weapon.missileSize.w, h: this.weapon.missileSize.h};
          missileSprite =       this.weapon.missileSprite.left;
          missileFireEffectSprite = this.weapon.missileSprite.fire.left;
          }
      else if (this.direction.right){
          missilePosition.x =   this.right - this.weapon.missileSize.w / 2;
          missilePosition.y =   this.top + this.size.h / 2 + this.weapon.missileSize.h / 2;
          missileVelocity.x =   this.weapon.missileSpeed;
          missileVelocity.y =   0;
          missileSize =         {w: this.weapon.missileSize.w, h: this.weapon.missileSize.h};
          missileSprite =       this.weapon.missileSprite.right;
          missileFireEffectSprite = this.weapon.missileSprite.fire.right
      }
      this.weapon.attack({missileSprite, missileFireEffectSprite, missilePosition, missileVelocity, missileSize, missileOwner});
    }
  }

  /*
    Characters can jump while not crouching and have jump count left.
    The additional jumps can only be initiated while the character's Y velocity is positive.
    So, if a character has started falling down (meaning the movement is downwards,
    another jump can't be initiated).
  */
  jump() {
    if (this.isDead) return;
    
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
      if (platform.killOnTouch && !DEBUG_MODE){
        this.currentHP = 0;
      }

      /*
        Detecting from which side the collision has occured. The reference is character.
      */
      // Check if collision occured from the left side.
      else if (this.oldLeft > platform.oldRight){
        // Platforms which become visible once you land on them do not cause collision from left side
        if (platform.visible !== false){
          // Platforms that are "landingOnly" do not cause left side collision
          if (platform.landingOnly !== true){
            this.position.x = platform.right + 0.1;
            this.velocity.x = platform.velocity.x;
          }
        }

        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          console.log("Left side collision detected");
          Graphics.drawLine({x1: this.position.x, y1: 0, x2: this.position.x, y2: CANVAS_GAME.height, thickness: 1, color: 'red', ctx: GAME_CTX});
        }
      }

      // Check if collision occured from the right side.
      else if (this.oldRight < platform.oldLeft){
        // Platforms which become visible once you land on them do not cause collision from right side
        if (platform.visible !== false){
          // Platforms that are "landingOnly" do not cause left side collision
          if (platform.landingOnly !== true){
            this.position.x = platform.left - this.size.w - 0.1;
            this.velocity.x = platform.velocity.x;
          }
        }

        // In debug mode, display red vertical line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          console.log("Right side collision detected");
          Graphics.drawLine({x1: this.position.x + this.size.w, y1: 0, x2: this.position.x + this.size.w, y2: CANVAS_GAME.height, thickness: 1, color: 'red', ctx: GAME_CTX});
        }
      }

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

        // In debug mode, display red horizontal line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          console.log("Bottom side collision detected");
          Graphics.drawLine({x1: 0, y1: this.position.y + this.size.h, x2: CANVAS_GAME.width, y2: this.position.y + this.size.h, thickness: 1, color: 'red', ctx: GAME_CTX});
        }
      }

      // Check if collision occured from the top side (bumping into the platform from below).
      else if (this.oldTop > platform.oldBottom){
        // Platforms which become visible once you land on them do not cause collision from below
        if (platform.visible !== false){
          // Platforms that are "landingOnly" do not cause left side collision
          if (platform.landingOnly !== true){
            this.position.y = platform.bottom + 0.1;
            this.velocity.y = -this.velocity.y;
          }
        }

        // In debug mode, display red horizontal line whenever collision occurs
        if (this === PLAYER && DEBUG_MODE){
          console.log("Top side collision detected");
          Graphics.drawLine({x1: 0, y1: this.position.y, x2: CANVAS_GAME.width, y2: this.position.y, thickness: 1, color: 'red', ctx: GAME_CTX});
        }
      }
    });

    // Collision with an enemy character if this === PLAYER
    if (this === PLAYER && !this.damaged){
      ENEMIES.forEach(enemy => {
        if (!this.checkCollision(enemy)) return;
        
        // Lethal damage
        if (this.currentHP - enemy.contactDamage < 0){
          enemy.contactDamage = this.currentHP;
        }
        
        this.damaged = true;
        if (!DEBUG_MODE){
          this.currentHP = this.currentHP - enemy.contactDamage;
        }
        
        // When the player gets damaged, give PLAYER_DAMAGED_DELAY time before allowing another damage.
        const timer = new Timer(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
        timer.start();

        console.log("Collision with an enemy character detected");
      });
    }

    // Collision with an orb collectible
    if (this === PLAYER){
      ORBS.forEach(orb => {
        if (!this.checkCollision(orb)) return;
        orb.collect();

        console.log("Collision with an orb detected");
      });
    }

    // Collision with missiles
    MISSILES.forEach(missile => {
      // If no collision with current missile, move to next missile
      if (!this.checkCollision(missile)) return;

      // Missile owner is PLAYER and damaged entity is enemy
      if (this.isEnemy && missile.owner === PLAYER){
        // Lethal damage
        if (this.currentHP - missile.damage < 0){
          missile.damage = this.currentHP;
        }
        // Damage an enemy
        this.currentHP = this.currentHP - missile.damage;
        removeFromArray(MISSILES, missile);

        console.log("A missile has hit the enemy");
      }

      // Missile owner is enemy and damaged entity is PLAYER
      else if (this === PLAYER && missile.owner.isEnemy){
        // Lethal damage
        if (this.currentHP - missile.damage < 0){
          missile.damage = this.currentHP;
        }

        // If PLAYER is currently in damaged state, do not damage it again
        if (!this.damaged){
          this.damaged = true;
          if (!DEBUG_MODE){
            this.currentHP = this.currentHP - missile.damage;
          }
          const timer = new Timer(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
          timer.start();
        }
        removeFromArray(MISSILES, missile);

        console.log("Collision with an enemy missile detected");
      }
    });

    // Collision with Fireballs
    if (this === PLAYER && !this.damaged){
      FIREBALLS.forEach(fireball => {
        if (!this.checkCollision(fireball)) return;
        
        // Lethal damage
        if (this.currentHP - fireball.damage < 0){
          fireball.damage = this.currentHP;
        }
        
        this.damaged = true;
        if (!DEBUG_MODE){
          this.currentHP = this.currentHP - fireball.damage;
        }
        const timer = new Timer(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
        timer.start();

        console.log("Collision with fireball detected");
      });
    }
  }

  /*
    Drawing HP bar above the character.
    HP bar consists of HP shell and remaining HP which is reduced from left to right.
  */
  drawHPBar() {

    // Non BOSS health bars
    if (this !== BOSS){
      // Common
      const HPOffsetFromTop = 		10;

      // HP Shell properties
      const HPShellBorderSize = 	0;
      const HPShellBorderColor =  "#552f2f";
      const HPShellWidth = 				(this.size.w * 2) - (HPShellBorderSize * 2) < 500 ? (this.size.w * 2) - (HPShellBorderSize * 2): 500; // If HP bar becomes bigger than 500, then cap it to 500
      const HPShellHeight = 			15 - (HPShellBorderSize * 2);
      const HPShellColor = 				"#552f2f";
      const HPShellPositionX = 		this.center.x - HPShellWidth / 2 + HPShellBorderSize;
      const HPShellPositionY = 		this.top - HPOffsetFromTop - HPShellHeight;

      // HP Bar properties
      const HPScale = 						HPShellWidth / this.maxHP;
      const HPBarWidth = 					this.currentHP * HPScale;
      const HPBarHeight = 				HPShellHeight;
      const HPBarColors = 				{healthy: "#226d34", weakened: "#6d6c22", critical: "#a92d2d"};
      let 	HPBarColor = 					null;
      const HPBarPositionX = 			HPShellPositionX;
      const HPBarPositionY = 			HPShellPositionY;

      // Determining HP bar color based on current health percentage
      const HPRatio = HPBarWidth / HPShellWidth;
      if (HPRatio > 0.66 && HPRatio <= 1){
        HPBarColor = HPBarColors.healthy;					// Heath percentage is in healthy range
      }
      else if (HPRatio > 0.33 && HPRatio <= 0.66){
        HPBarColor = HPBarColors.weakened;				// Heath percentage is in weakened range
      }
      else {
        HPBarColor = HPBarColors.critical;				// Heath percentage is in critical range
      }
      Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: GAME_CTX});      // Top border
      Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: GAME_CTX});     // Left border
      Graphics.drawLine({x1: HPShellPositionX + HPShellWidth, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: GAME_CTX});     // Right border
      Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY + HPShellHeight, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: GAME_CTX});    // Bottom border
      Graphics.drawRectangle({x: HPShellPositionX, y: HPShellPositionY, w: HPShellWidth, h: HPShellHeight, color: HPShellColor, ctx: GAME_CTX}); // Drawing HP Shell
      Graphics.drawRectangle({x: HPBarPositionX, y: HPBarPositionY, w: HPBarWidth, h: HPBarHeight, color: HPBarColor, ctx: GAME_CTX});           // Drawing HP Bar
    }
  }

  // Draws the character and their HP bars
  draw() {
    GAME_CTX.drawImage(
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
      Maximum downwards velocity is 15.
    */
    if (this.top < CANVAS_GAME.height){
      this.velocity.y = this.velocity.y < 15 ? this.velocity.y + GRAVITY : 15;          // Increase character velocity Y by GRAVITY amount
    }
    /*
      The character top side is greater than the game canvas height.
      Character went out of bounds, kill it.
    */
    else {
      this.currentHP = 0;
    }

    /*
      Checking whether the character current HP is 0.
      If it is, set character as dead.
    */
    if (this.currentHP <= 0){
      this.isDead = true;
      if (this !== PLAYER){
        // Creating death animation upon enemy death
        if (this.sprite.death){
          new Effect({
            x: this.center.x - this.sprite.death.w / 2,
            y: this.center.y - this.sprite.death.h / 2,
            w: this.sprite.death.w,
            h: this.sprite.death.h,
            sprite: {
              default: this.sprite.death.src,
            },
          });
        }
        // Playing death sound
        if (this.deathSound){
          const deathSound = createSound(this.deathSound);
          deathSound.play();
        }
        
        removeFromArray(ENEMIES, this);
      }
    }

    /*
      Checking if character is crouching. If it is, set new character height to crouching height.
      Otherwise set to default height.
    */
    this.size.h = this.isCrouching ? this.crouchHeight : this.originalHeight;

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
      // Only melee enemies patrol
      if (this.enemyType === "melee" && this.meleePatrol){
        this.meleePatrol();
      }
      // Ranged enemies patrol
      else if (this.enemyType === "range" && this.rangePatrol){
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
    this.center.x = 				this.left + this.size.w / 2;
    this.center.y = 				this.top + this.size.h / 2;

    // Draw character at new coordinates
    this.draw();
  }
}