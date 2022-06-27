import { EnemyBoss } from "../../classes/Characters/EnemyBoss.js";
import { Timer } from "../../classes/Timer.js";
import { randomNumber } from "../../functions/randomnumber.js";
import { Missile } from "../../classes/Weapons/Missile.js";
import { stopSound } from "../../functions/stopsound.js";

export const bossFight = () => {
    // Spawn the boss
    BOSS = new EnemyBoss({
        x: 11000,
        y: 200,
        w: 281,
        h: 165,
        jumpHeight: 20,
        jumps: 1,
        enemyType: "boss",
        movespeed: 3,
        HP: 2000,
        sprite: {
            idle: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossIdleLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
            },
            move: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossIdleLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
            },
            jump: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossJumpLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossJumpRight.png`,
            },
            fall: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossFallLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossFallRight.png`,
            },
            default: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
        },
    });

    // Playing boss fight Music
    stopSound(LEVEL_MUSIC);
    LEVEL_MUSIC.src = `${PATH_AUDIO}/Level 1/BossFight.mp3`;
    LEVEL_MUSIC.play();

    BOSS.attackCooldown = 3000;
    setTimeout(bossAttack, 1000);
    bossFightRender();
}


// Rendering boss fight
const bossFightRender = () => {
    // Always have boss face the player
    if (PLAYER.center.x < BOSS.center.x){
        BOSS.direction.left = true;
        BOSS.direction.right = false;
    }
    else if (PLAYER.center.x > BOSS.center.x){
        BOSS.direction.right = true;
        BOSS.direction.left = false;
    }

    /*
        Checking if the boss used its attack2 (charging)
    */
    if (BOSS.isCharging){
        attack2Check();
    }

    // Death of the boss
    if (BOSS.HP <= 0){
        BOSS = null;
        // Endgame
        // ...
    }

    // Keep rendering
    else {
        requestAnimationFrame(bossFightRender);
    }
}

// Looping attacks
const bossAttack = () => {
    // If player is outside of the boss area, always use attack 1
    if (PLAYER.center.x < BOSS_AREA.left || PLAYER.center.x > BOSS_AREA.right){
        attack1();
        console.log("PLAYER outside boss area");
    }
    else {
        // Randomizing attack
        if (randomNumber(1, 2) === 1){
            attack1();
        }
        else {
            if (!BOSS.isCharging){
                attack2();
            }
        }
    }

    // Queueing next attack
    const attackTimer = new Timer(bossAttack, BOSS.attackCooldown);
    attackTimer.start();
}

/*
    Attack 1
*/
const attack1 = () => {
    // Attack setup variables
    const missileSize = {w: 100, h: 100};
    const missileVelocity = BOSS.direction.left ? -4 : 4;
    const missileX = BOSS.direction.left ? BOSS.left + missileSize.w / 2 : BOSS.right - missileSize.w / 2
    const missileY = BOSS.top + missileSize.h / 2;
    const missileDamage = 45;

    // Creating the missile
    new Missile({
        x: missileX,
        y: missileY,
        w: missileSize.w,
        h: missileSize.h,
        velocity: {
            x: missileVelocity,
            y: 0,
        },
        sprite: {
            left: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileLeft.png`,
            right: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileRight.png`,
            default: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileLeft.png`,
        },
        damage: missileDamage,
        owner: BOSS,
    });
}

/*
    Attack 2
*/
const attack2 = () => {
    BOSS.contactDamage = 30;
    BOSS.chargeVelocity = 8;
    BOSS.chargePoint = PLAYER.center.x;
    BOSS.chargeDirection = BOSS.direction.left ? -1 : 1;
    BOSS.isCharging = true;

    // Start charging
    BOSS.velocity.x = BOSS.chargeVelocity * BOSS.chargeDirection;
}

const attack2Check = () => {
    // Checking which direction boss is charging
    if (BOSS.chargeDirection === -1){
        // Charging left
        // Checking whether boss has reached chargePoint
        if (BOSS.center.x <= BOSS.chargePoint){
            // Stop the attack and reset contact damage
            BOSS.isCharging = false;
            BOSS.velocity.x = 0;
            BOSS.contactDamage = 10;
            return;
        }
    }
    else if (BOSS.chargeDirection === 1){
        // Charging right
        // Checking whether boss has reached chargePoint
        if (BOSS.center.x >= BOSS.chargePoint){
            // Stop the attack and reset contact damage
            BOSS.isCharging = false;
            BOSS.velocity.x = 0;
            BOSS.contactDamage = 10;
            return;
        }
    }
}