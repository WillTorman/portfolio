// Get player input
key_left = keyboard_check(vk_left); // key_left = -1 || 0
key_right = keyboard_check(vk_right); // key_right = 1 || 0
key_jump = keyboard_check_pressed(vk_up);
key_crouch = keyboard_check_pressed(vk_down);
key_shoot = keyboard_check(vk_space);

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
if (keyboard_check(vk_left)){ // Face the left
	image_xscale = -1;
	sprite_index = sP2Run;
} else if (keyboard_check(vk_right)) { // Face the right
	image_xscale = 1;
	sprite_index = sP2Run;
} else {
    sprite_index = sP2; // Set idle animation when no movement
}

// crouch
if (keyboard_check(vk_down)){
	sprite_index = sP2Crouch;
	image_index = 2;
	walkspd = 2;
} else {
	walkspd = 4;
}
// jump
if (keyboard_check(vk_up)) {
	sprite_index = sP2Jump;
}


////////
// Shoot
////////
if (keyboard_check_pressed(vk_space)){
	instance_create_layer(x, y, "Instances", oBullet2)
	instance_create_layer(x, y, "Instances", oMuzzleFlash)
	
	if (image_xscale = -1){
	oMuzzleFlash.direction = 180; // face left
	oBullet2.direction = 180; // face left
	} else {
		oMuzzleFlash.direction = 0; // face left
		oBullet2.direction = 0; // face right
	}
	oMuzzleFlash.image_angle = oMuzzleFlash.direction; // muzzle sprite direction
	oBullet2.image_angle = oBullet2.direction; // bullet sprite direction
	audio_play_sound(snd_shot, 1, false);
}


////////
// Death
////////
if (hp2 <= 0) {
	lives2 -= 1;
	instance_destroy()
}