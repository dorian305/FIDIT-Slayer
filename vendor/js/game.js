import { MainMenu } 	from "./mainmenu.js";
import { level1 } 		from "./levels/level1.js";

/*
	Starting level 1 and storing it into a global variable
	so that restart level functionality knows which level to initiate.
*/
CURRENT_LEVEL = level1;
level1();