"use strict";
import context from "./scripts/context.js";
import * as Utils from "./scripts/utils.js";
import * as Noise from "./scripts/noise.js";

let width = context.canvas.width;
let height = context.canvas.height;

let numberOfEnemies = 25;
let frameCount = 0;

let hasStarted = false;
let gameOver = false;
let hasWon = false;

let player = {
    x: 0,
    y: 0,
    size: 20,
    hue: 0
};

let enemies = [];

window.onmousemove = mouseMove;
window.onmousedown = mouseDown;

setup();
update();

function setup() {
    context.textAlign = "center";

    for (let i = 0; i < numberOfEnemies; i++) {
        let enemySize = Utils.randomNumber(2, 40);
        let enemy = {
            x: Utils.randomNumber(enemySize, width - enemySize),
            y: Utils.randomNumber(enemySize, height - enemySize),
            size: enemySize,
            hue: Utils.randomNumber(0, 360),
            seedX: Utils.randomNumber(0, 99999),
            seedY: Utils.randomNumber(0, 99999)
        };
        enemies[i] = enemy;
    }
}

function update() {
    frameCount++;
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    if (enemies.length == 0) {
        gameOver = true;
        hasWon = true;
    } else {
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (hasStarted) {
                let newX = enemy.x + Noise.perlinNoise(enemy.seedX + frameCount / 100) * 10 - 5;
                let newY = enemy.y + Noise.perlinNoise(enemy.seedY + frameCount / 100) * 10 - 5;
                if (newX >= 0 + enemy.size && newX <= width - enemy.size) {
                    enemy.x = newX;
                }

                if (newY >= 0 + enemy.size && newY <= height - enemy.size) {
                    enemy.y = newY;
                }

                let distance = Utils.calculateDistance(player.x, player.y, enemy.x, enemy.y);
                if (distance <= player.size + enemy.size) {
                    if (player.size >= enemy.size) {
                        enemies.splice(i, 1);
                        player.size += 5;
                        player.hue = enemy.hue;
                    } else {
                        gameOver = true;
                        break;
                    }
                }

                for (let j = 0; j < enemies.length; j++) {
                    let otherEnemy = enemies[j];
                    if (i != j) {
                        let distance = Utils.calculateDistance(otherEnemy.x, otherEnemy.y, enemy.x, enemy.y);
                        if (distance <= otherEnemy.size + enemy.size) {
                            if (otherEnemy.size >= enemy.size) {
                                otherEnemy.size += 5;
                                otherEnemy.hue = enemy.hue;
                                enemies.splice(i, 1);
                            } else {
                                enemy.size += 5;
                                enemy.hue = otherEnemy.hue;
                                enemies.splice(j, 1);
                            }
                        }

                    }
                }
            }

            if (enemy < 0 + enemy.size) {
                enemy.x += enemy.size * 2;
                console.log("test");
            } else if (enemy.x > width - enemy.size) {
                enemy.x -= enemy.size * 2;
            }

            if (enemy.y < 0 + enemy.size) {
                enemy.y += enemy.size * 2;
            } else if (enemy.y > height - enemy.size) {
                enemy.y -= enemy.size * 2;
            }

            context.fillStyle = Utils.hsl(enemy.hue, 100, 50);
            Utils.fillCircle(enemy.x, enemy.y, enemy.size);
        }


    }
    context.fillStyle = Utils.hsl(player.hue, 100, 50);
    Utils.fillCircle(player.x, player.y, player.size);

    if (!hasStarted) {
        context.fillStyle = "black";
        context.font = "bold 32pt Arial";
        context.fillText("Choose a startposition and click to start", width / 2, 50);
    }

    if (!gameOver) {
        requestAnimationFrame(update);
    } else {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);
        context.font = "bold 64pt Arial";
        context.fillStyle = "black";
        if (hasWon) {
            context.fillText("YOU WON", width / 2, height / 2);
        } else {
            context.fillText("GAME OVER", width / 2, height / 2);
        }
        context.font = "bold 32pt Arial";
        context.fillText("click to play again", width / 2, height / 2 + 100);
    }
}

function mouseMove(e) {
    player.x = e.pageX;
    player.y = e.pageY;
}
/**
 * 
 * @param {MouseEvent} e 
 */
function mouseDown(e) {
    if (gameOver) {
        hasStarted = false;
        gameOver = false;
        hasWon = false;
        player.size = 20;
        player.hue = 0;
        setup();
        update();
    } else {
        hasStarted = true;
    }

}