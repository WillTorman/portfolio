// Draw the health bar sprite based on health
if (health >= 5) {
    draw_sprite(sHealthBar, 0, x, y - 26);
} else if (health == 4) {
    draw_sprite(sHealthBar, 1, x, y - 26);
} else if (health == 3) {
    draw_sprite(sHealthBar, 2, x, y - 26);
} else if (health == 2) {
    draw_sprite(sHealthBar, 3, x, y - 26);
} else if (health == 1) {
    draw_sprite(sHealthBar, 4, x, y - 26);
} else if (health == 0) {
    draw_sprite(sHealthBar, 5, x, y - 26);
}
