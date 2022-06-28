### Art Design
- High fidelity art
- Dungeon art
- Energetic and violent (intense but dark colors)

### UI Design
- adaptive (Not mobile friendly!)
#### Main Menu UI Design
The background will be dimmed and in front of it a large window with the following buttons:
- [If it exists] Continue game
- New game

#### Ingame UI Design
- Top left is the character health bar UI, enemy HP bars are displayed above the character

#### Pause Screen UI Design
The pause screen will dim the background and offer several buttons:
- Resume
- Restart
- Main menu

### Level Design and Goals
- Game is split up in 10 levels
- The goal is to reach the end of the level
- There are secret platforms and passageways that lead to certain powerups
- Enemy placement makes finishing level challenging
- You have to finish a level in order to unlock the next level


### Main Character Design
- Character is a human dressed in black and body armor
- When player dies, game is over and character spawns at the start of the level
- Character is spawned with a ranged weapon which it can use to attack enemies from afar

### Enemy Design
- Enemies are tactically scattered throughout the level, making certain level section harder to pass
- At the end of the level, there is a boss which has to be defeated in order to finish the level
- Every level contains a boss
- Enemies are incrementally getting tougher with levels

### Enemy Types
- Melee
- Ranged
- Damaging obstacles such as fireballs

### Enemy List
- Enemies are mostly level-exclusive, though some might reappear at further levels.

- `ShieldDrone`: This is a simple melee enemy unit. It is similar in size to the main character. It patrols around the area, and when main character gets within its attack range, it increases in movespeed and seeks it, damaging it upon contact. Health: 50, Damage: 5 - 15, Movespeed: 1 - 3.
- `RottenKau`: This is a simple ranged enemy unit. It is as large as the main character and likewise humanoid but looks like a zombie or something. It has a ranged weapon with which it attacks you. Health: 30; Damage: 10, Movespeed: 0 (Stationary).

### Boss List
- `TVRTKO`   [Levels 1]: 

### Pick-up List
- Orb of Rejuvenation (Health refill) | [Common]
- Orb of Health (Health increase)     | [Rare]