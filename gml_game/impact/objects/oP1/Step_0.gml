// Get player input
key_left = keyboard_check(ord("A")); // key_left = -1 || 0
key_right = keyboard_check(ord("D")); // key_right = 1 || 0
key_jump = keyboard_check_pressed(ord("W"));
key_crouch = keyboard_check_pressed(ord("S"));
key_shoot = keyboard_check(vk_tab);

////////////////
// Calc movement
////////////////

// Horizontal movement
var move = key_right - key_left;
xspd = move * walkspd;
yspd = yspd + grav;

// jump
if (place_meeting(x, y + 1, oWall)) && (key_jump) {
	yspd = -4;
	xspd = 0;
}


///////////////////
// check collisions
///////////////////
// check horizonal collision
if (place_meeting(x+xspd, y, oWall)) {
	while (!place_meeting(x+sign(xspd), y, oWall)) {
	    x = x + sign(xspd);
	}
	xspd = 0;
}
x = x + xspd; // current pos + hspd


// check vertical collision
var move = key_right - key_left;
xspd = move * walkspd;

if (place_meeting(x, y+yspd, oWall)) {
	while (!place_meeting(x, y+sign(yspd), oWall)) {
	    y = y + sign(yspd);
	}
	yspd = 0;
}
y = y + yspd; // current pos + vspd


////////////
// Animation
////////////
if (keyboard_check(ord("A"))){ // Face the left
	image_xscale = -1;
	sprite_index = sP1Run;
} else if (keyboard_check(ord("D"))) { // Face the right
	image_xscale = 1;
	sprite_index = sP1Run;
} else {
    sprite_index = sP1; // Set idle animation when no movement
}

// crouch
if (keyboard_check(ord("S"))){
	sprite_index = sP1Crouch;
	image_index = 2;
	walkspd = 2;
} else {
	walkspd = 4;
}
// jump
if (keyboard_check(ord("W"))) {
	sprite_index = sP1Jump;
}


////////
// Shoot
////////
if (keyboard_check_pressed(vk_tab)){
	instance_create_layer(x, y, "Instances", oBullet1)
	instance_create_layer(x, y, "Instances", oMuzzleFlash)
	
	if (image_xscale = -1){
	oMuzzleFlash.direction = 180; // face left
	oBullet1.direction = 180; // face left
	} else {
		oMuzzleFlash.direction = 0; // face left
		oBullet1.direction = 0; // face right
	}
	oMuzzleFlash.image_angle = oMuzzleFlash.direction; // muzzle sprite direction
	oBullet1.image_angle = oBullet1.direction; // bullet sprite direction
	audio_play_sound(snd_shot, 1, false);
}


////////
// Death
////////
if (health <= 0) {
	lives -= 1;
	instance_destroy()
}