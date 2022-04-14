import { level1 } 	from "./levels/level1/level1.js";
import { Graphics }	from "./classes/Graphics.js";

// /*
// 	Preloading images.
// */
// const imageLoaded = () => {
// 	imageCounter++;
// 	console.log("Image loaded.");
// 	if (imageCounter === numOfImages) {
// 		console.log("All images have been loaded.");

// 		/*
// 			Starting level 1 and storing it into a global variable
// 			so that restart level functionality knows which level to initiate.
// 		*/
// 		CURRENT_LEVEL = level1;
// 		level1();
// 	}
// }
// const imagesToPreload = [
// 	Graphics.createImage(`${PATH_IMAGES}/Button.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Level 1/Background.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Level 1/EnemyStandLeft.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Level 1/EnemyStandRight.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Level 1/Ground.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Orbs/OrbOfRejuvenation.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Orbs/OrbOfHealth.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Player/PlayerStandLeft.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Player/PlayerStandRight.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileUp.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileLeft.png`),
// 	Graphics.createImage(`${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileRight.png`),
// ];
// const numOfImages = 	imagesToPreload.length;
// let imageCounter = 		0;
// imagesToPreload.forEach(image => {
// 	image.onload = imageLoaded();
// });

/*
	Starting level 1 and storing it into a global variable
	so that restart level functionality knows which level to initiate.
*/
CURRENT_LEVEL = level1;
level1();