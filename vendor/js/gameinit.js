/*
  Game variables and default settings
*/
const CANVAS =                  document.querySelector('canvas');           // Canvas element
const CTX =                     CANVAS.getContext("2d");                    // Canvas context
CANVAS.width =                  innerWidth;                                 // Setting canvas width to the viewport width
CANVAS.height =                 innerHeight;                                // Setting canvas height to the viewport height
const PATH_ASSETS =				"/assets/";									// Absolute path to game assets
const PATH_SPRITES =			`${PATH_ASSETS}sprites/`;
const PATH_AUDIO =				`${PATH_ASSETS}audio/`;
const PATH_IMAGES =				`${PATH_ASSETS}images/`;
let PLAYER =                    null;                                        // Player character
let PLAYER_SIZE =               {w: 35, h: 78};                              // Player character size
let PLAYER_SPRITE =             `${PATH_SPRITES}playeridleright.png`; 		 // Sprite for player character
const PLAYER_DAMAGED_DELAY =    2000;                                        // Delay between player taking damages
let PLAYER_INITIATED_JUMP =     false;                                       // Flag to prevent jump to trigger when holding down spacebar
let LEFT_WALL =                 null;                                        // Level left wall
let RIGHT_WALL =                null;                                        // Level right wall
let GAME_PAUSED =               false;                                       // Game state flag (Paused / Resumed)
let INGAME =					false;										 // Playing a level or not
let DEBUG_MODE =                false;                                       // Flag for when debug mode is enabled
const PLATFORMS =               [];                                          // All platforms in the game
const CHARACTERS =				[];                                          // All characters in the game
const GENERIC_OBJECTS =			[];											 // All generic objects
const BUTTONS =					[];											 // UI buttons
const ORBS = 					[];											 // Orbs collectibles. There are orbs of heal, orbs of strength...
let CLICKED_BUTTON =			null;																				 
const GRAVITY =                 0.5;                                         // Gravity constant, implementation in character class
let LEVEL_BEGINNING_EDGE =    	null;	                                     // Leftmost edge of the game level
let LEVEL_END_EDGE =          	null;	                                     // Rightmost edge of the game level
let GROUND_PLATFORM_SIZE =    	{w: 50, h: 50};                              // Ground platform size
const DIMMED_BACKGROUND_COLOR = "#000000b3";								 // Dimmed background color
const GAME_FONT =				"Consolas";									 // Font which is used for the text in game
const GAME_FPS =				75;											 // Animation FPS
let CURRENT_LEVEL =				null;										 // Keeps track of current level

/*
	Disabling window zoom in / out
*/
window.addEventListener("keydown", event => {
		if (event.ctrlKey == true &&
			(event.which == '61' ||
			 event.which == '107' ||
			 event.which == '173' ||
			 event.which == '109' ||
			 event.which == '187' ||
			 event.which == '189')){
			event.preventDefault();
		}
});
['wheel','mousewheel','DOMMouseScroll'].forEach(event => {
	window.addEventListener(event, e => {
		if (e.ctrlKey == true) event.preventDefault();
	}, { passive: false });
});

/*
	Initializing key events for the game
	such as jumping, moving left and right, crouching,
	toggling debug mode etc...
*/
['keydown', 'keyup'].forEach(event => {
	window.addEventListener(event, e => {
		// Events are only available if the PLAYER is existing
		if (PLAYER){
			
			/*
				Player left right movement, crouching and upwards aiming.
				The condition checks whether the triggering key is contained in the array,
				and if it is, just updates that key as a property to true/false,
				depending if the key is pressed or released.
			*/
			if (['a', 'd', 'w', 's'].includes(e.key.toLowerCase())){    
				PLAYER.keys[e.key.toUpperCase()].pressed = event === 'keydown' ? true : false;
			}
			/*
				Player character jumping.
				First check whether the jump key has been pressed, which is spacebar.
				Then, check whether the key has been pressed or released,
				and that the jump flag is either true or false. The jump flag is set to true
				when the spacebar is pressed, and it remains true until the spacebar is released.
				Why? To prevent the spacebar being pressed down to continuously trigger jumping action.
				This way, you have to release and press spacebar to trigger another jump.
			*/
			if (e.key === " "){
				if (event === "keydown" && !PLAYER_INITIATED_JUMP){
					PLAYER_INITIATED_JUMP = true;
					PLAYER.jump();
				}
				else if (event === "keyup" && PLAYER_INITIATED_JUMP){
					PLAYER_INITIATED_JUMP = false;
				}
			}
	
			// Toggling debug mode
			if (e.key.toLowerCase() === "z" && event === "keydown"){
				DEBUG_MODE = !DEBUG_MODE;
			}
		}
	});
});

/*
	Event listener that tracks whether mouse click has happened on an UI button.
	Also mouseover
*/
["mousemove", "click"].forEach(event => {
	window.addEventListener(event, e => {
		if (BUTTONS){
			let mouse = {x: e.clientX, y: e.clientY};							// Getting mouse coordinates
			/*
				Looping through each button and checking whether the coordinates of the mouse pointer
				were inside any of the buttons when the mouse click occured.
			*/
			BUTTONS.forEach(button => {
				if (!(mouse.x < button.position.x || mouse.x > button.position.x + button.size.w || mouse.y < button.position.y || mouse.y > button.position.y + button.size.h)){
					if (event === "click"){
						/*
							The click occured on a button, which means the button was clicked.
							Perform the button's action, clear the BUTTONS array and exit forEach.
						*/
						button.action();
						BUTTONS.length = 0;
						return;
					}
					else if (event === "mouseover"){
						/*
							Mouse is hovering over button, add visual feedback.
						*/
						
					}
				}
			});
		}
	});
});