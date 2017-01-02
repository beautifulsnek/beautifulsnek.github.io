function noop() { }
function constant(x) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return x;
}; }
function sign(x) {
    return x < 0 ? -1 : x > 0 ? 1 : 0;
}
var playingSparkles = 0;
var soundSparkles = new Howl({
    src: ['audio/sparkles.ogg', 'audio/sparkles.mp3'],
    volume: 0.2,
    sprite: {
        a: [0, 700],
        b: [700, 1750]
    }
});
soundSparkles.on('play', function () {
    playingSparkles += 1;
});
soundSparkles.on('end', function () {
    playingSparkles -= 1;
    if (playingSparkles < 0) {
        console.log('Weird, playingSparkles < 0');
        playingSparkles = 0;
    }
});
var soundFlight = new Howl({
    src: ['audio/flights.ogg', 'audio/flights.mp3'],
    volume: 0.7,
    sprite: {
        shortA: [150, 1250],
        longA: [1650, 4050 - 1650],
        shortB: [4600, 5900 - 4600],
        longB: [6130, 8700 - 6130]
    }
});
var soundBang = new Howl({
    src: ['audio/bangs.ogg', 'audio/bangs.mp3'],
    volume: 0.4,
    sprite: {
        a: [50, 950],
        b: [1350, 1000]
    }
});
function playSparkles() {
    console.log('sparkles');
    if (playingSparkles < 3) {
        soundSparkles.play((Math.random() > 0.5) ? 'a' : 'b');
    }
}
function playShortFlight() {
    console.log('short');
    soundFlight.play('short' + ((Math.random() > 0.5) ? 'A' : 'B'));
}
function playLongFlight() {
    console.log('long');
    soundFlight.play('long' + ((Math.random() > 0.5) ? 'A' : 'B'));
}
function playBang() {
    console.log('bang');
    var clipNames = ['a', 'b'];
    var clip = clipNames[Math.floor(Math.random() * clipNames.length)];
    soundBang.play(clip);
}
function createCanvas(width, height) {
    var result = document.createElement('canvas');
    result.width = width;
    result.height = height;
    return result;
}
var COLOR_WHITE = 0, COLOR_RED = 1, COLOR_GREEN = 2, COLOR_BLUE = 3, COLOR_YELLOW = 4, COLOR_CYAN = 5, COLOR_PURPLE = 6, COLOR_ORANGE = 7, COLOR_VIOLET = 8;
var OFFSET_X = 0, OFFSET_Y = 1, OFFSET_COLOR = 2, OFFSET_S = 3, OFFSET_LIFE = 4, OFFSET_VX = 5, OFFSET_VY = 6, OFFSET_VS = 7, PARTICLE_DATA_LENGTH = 8;
var Fireworks = (function () {
    function Fireworks(bounds, gravity, palette) {
        if (gravity === void 0) { gravity = [0, 10]; }
        if (palette === void 0) { palette = (_a = {},
            _a[COLOR_WHITE] = '#FFFFFF',
            _a[COLOR_RED] = '#FF2200',
            _a[COLOR_GREEN] = '#00FF33',
            _a[COLOR_BLUE] = '#2266FF',
            _a[COLOR_YELLOW] = '#FFFF00',
            _a[COLOR_CYAN] = '#00FFFF',
            _a[COLOR_PURPLE] = '#FF00FF',
            _a[COLOR_VIOLET] = '#9922FF',
            _a[COLOR_ORANGE] = '#FF7711',
            _a); }
        this.bounds = bounds;
        this.gravity = gravity;
        this.palette = palette;
        this.particles = [];
        this.particleCallbacks = [];
        this.nextPurgePos = 0;
        this.purgeCountdownTime = 2;
        this.nextPurgeCountdown = this.purgeCountdownTime;
        var _a;
    }
    Fireworks.prototype.addParticle = function (x, y, color, s, life, vx, vy, vs, callback) {
        if (callback === void 0) { callback = noop; }
        this.particles.push(x, y, color, s, life, vx, vy, vs);
        this.particleCallbacks.push(callback);
    };
    Fireworks.prototype.purge = function (maxViewed, maxRemoved) {
        if (maxViewed === void 0) { maxViewed = 1000; }
        if (maxRemoved === void 0) { maxRemoved = 100; }
        var particles = this.particles, len = particles.length - this.nextPurgePos, start = this.nextPurgePos < len ? this.nextPurgePos : 0, boundLeft = this.bounds[3], boundTop = this.bounds[0], boundRight = this.bounds[1], boundBottom = this.bounds[2], viewedCount = 0, removedCount = 0, particleX, particleY, particleLife;
        for (var particleDataStart = start; (particleDataStart < len) && (viewedCount < maxViewed) && (removedCount < maxRemoved); particleDataStart += PARTICLE_DATA_LENGTH) {
            particleX = particles[particleDataStart + OFFSET_X];
            particleY = particles[particleDataStart + OFFSET_Y];
            particleLife = particles[particleDataStart + OFFSET_LIFE];
            if (particleX < boundLeft || particleX > boundRight ||
                particleY < boundTop || particleY > boundBottom ||
                particleLife <= 0) {
                var particleIndex = (particleDataStart / PARTICLE_DATA_LENGTH) | 0;
                /*if (particleLife <= 0) {
                 this.particleCallbacks[particleIndex](particleX, particleY);
                }*/
                this.removeParticle(particleIndex);
                removedCount += 1;
            }
            viewedCount += 1;
        }
        // TODO: This may repeatedly omit first 1 to first maxViewed particles
        this.nextPurgePos = (particleDataStart) % this.particles.length;
        //console.log(this.nextPurgePos);
    };
    Fireworks.prototype.removeParticle = function (index) {
        var particleCount = this.particles.length / PARTICLE_DATA_LENGTH;
        var removedParticleStart = index * PARTICLE_DATA_LENGTH;
        var lastParticleStart = this.particles.length - PARTICLE_DATA_LENGTH;
        this.particles[removedParticleStart + OFFSET_X] = this.particles[lastParticleStart + OFFSET_X];
        this.particles[removedParticleStart + OFFSET_Y] = this.particles[lastParticleStart + OFFSET_Y];
        this.particles[removedParticleStart + OFFSET_COLOR] = this.particles[lastParticleStart + OFFSET_COLOR];
        this.particles[removedParticleStart + OFFSET_S] = this.particles[lastParticleStart + OFFSET_S];
        this.particles[removedParticleStart + OFFSET_LIFE] = this.particles[lastParticleStart + OFFSET_LIFE];
        this.particles[removedParticleStart + OFFSET_VX] = this.particles[lastParticleStart + OFFSET_VX];
        this.particles[removedParticleStart + OFFSET_VY] = this.particles[lastParticleStart + OFFSET_VY];
        this.particles[removedParticleStart + OFFSET_VS] = this.particles[lastParticleStart + OFFSET_VS];
        this.particles.length -= PARTICLE_DATA_LENGTH;
        this.particleCallbacks[index] = this.particleCallbacks[particleCount - 1];
        this.
            particleCallbacks.length -= 1;
    };
    Fireworks.prototype.render = function (ctx) {
        var particles = this.particles, len = particles.length;
        //ctx.save();
        ctx.fillStyle = '#FFFFFF';
        for (var i = 0; i < len; i += PARTICLE_DATA_LENGTH) {
            if (particles[i + OFFSET_LIFE] <= 0)
                continue;
            var particleSize = particles[i + OFFSET_S];
            ctx.fillStyle = this.palette[particles[i + OFFSET_COLOR]];
            ctx.fillRect(particles[i + OFFSET_X], particles[i + OFFSET_Y], particleSize, particleSize);
        }
        //ctx.restore();
    };
    Fireworks.prototype.update = function (dt) {
        var particles = this.particles, len = particles.length, gravity = this.gravity, boundLeft = this.bounds[3], boundTop = this.bounds[0], boundRight = this.bounds[1], boundBottom = this.bounds[2], particleX, particleY;
        for (var i = 0; i < len; i += PARTICLE_DATA_LENGTH) {
            if (particles[i + OFFSET_LIFE] <= 0)
                continue;
            particles[i + OFFSET_X] += particles[i + OFFSET_VX] * dt;
            particles[i + OFFSET_Y] += particles[i + OFFSET_VY] * dt;
            particles[i + OFFSET_S] += particles[i + OFFSET_VS] * dt;
            if (particles[i + OFFSET_S] < 0)
                particles[i + OFFSET_S] = 0;
            particles[i + OFFSET_LIFE] -= dt;
            if (particles[i + OFFSET_LIFE] <= 0) {
                this.particleCallbacks[i / PARTICLE_DATA_LENGTH](particles[i + OFFSET_X], particles[i + OFFSET_Y], particles[i + OFFSET_VX], particles[i + OFFSET_VY]);
            }
            // Gravity and air drag
            particles[i + OFFSET_VX] += gravity[0] * dt;
            particles[i + OFFSET_VY] += gravity[1] * dt;
        }
        this.nextPurgeCountdown -= 1;
        if (this.nextPurgeCountdown <= 0) {
            this.purge(100000, 1000);
            this.nextPurgeCountdown = this.purgeCountdownTime;
        }
    };
    return Fireworks;
}());
function randint(low, high) {
    if (high === void 0) {
        high = low;
        low = 0;
    }
    return Math.floor(Math.random() * (high - low) + low);
}
function randreal(low, high) {
    if (high === void 0) {
        high = low;
        low = 0;
    }
    return (Math.random() * (high - low) + low);
}
function randomFloatRangeGetter(range) {
    return function () {
        return randreal(range[0], range[1]);
    };
}
function randomRangeGetter(range) { return function () { return randint(range[0], range[1]); }; }
function randomSequenceGetter(sequence) {
    return function () { return sequence[Math.floor(Math.random() * sequence.length)]; };
}
function multiplyFn(k, f) {
    return function () {
        return f() * k;
    };
}
function spawnRingExplosion(fireworks, x, y, particleCount, depth, velocityRange, life) {
    if (particleCount === void 0) { particleCount = 60; }
    if (depth === void 0) { depth = 1; }
    if (velocityRange === void 0) { velocityRange = [40, 60]; }
    var angleBetween = (Math.PI * 2) / particleCount;
    for (var i = 0; i < particleCount; ++i) {
        var vx = Math.cos(i * angleBetween) * randint(velocityRange[0], velocityRange[1]);
        var vy = Math.sin(i * angleBetween) * randint(velocityRange[0], velocityRange[1]);
        fireworks.addParticle(x, y, 3, 3, life !== void 0 ? life : Math.random() + 3, vx, vy, -0.7, depth < 2 ? noop : function (x, y) { spawnRingExplosion(fireworks, x, y, particleCount, depth - 1, velocityRange); });
    }
}
function spawnExplosion(fireworks, data) {
    var getNewParticleX = {
        'number': constant(data.x),
        'object': randomRangeGetter(data.x),
        'function': data.x
    }[typeof data.x];
    var getNewParticleY = {
        'number': constant(data.y),
        'object': randomRangeGetter(data.y),
        'function': data.y
    }[typeof data.y];
    var getNewParticleV = {
        'number': constant(data.velocity),
        'object': randomFloatRangeGetter(data.velocity),
        'undefined': randomFloatRangeGetter([30, 60]),
        'function': data.velocity
    }[typeof data.velocity];
    var getNewParticleLife = {
        'number': constant(data.life),
        'object': randomFloatRangeGetter(data.life),
        'undefined': randomFloatRangeGetter([2.6, 3.4]),
        'function': data.life
    }[typeof data.life];
    var getNewParticleSize = {
        'number': constant(data.size),
        'object': randomRangeGetter(data.size),
        'undefined': constant(3),
        'function': data.size
    }[typeof data.size];
    var getNewParticleColor = {
        'number': constant(data.color),
        'object': randomSequenceGetter(data.color),
        'undefined': constant(COLOR_WHITE),
        'function': data.color
    }[typeof data.color];
    var getNewParticleVS = {
        'number': constant(data.vs),
        'object': randomFloatRangeGetter(data.vs),
        'undefined': constant(-1),
        'function': data.vs
    }[typeof data.vs];
    var getNewParticleVelocityAddition = {
        'object': constant(data.velocityAddition),
        'undefined': constant([0, 0]),
        'function': data.velocityAddition
    }[typeof data.velocityAddition];
    var getParticleCount = {
        'number': constant(data.particleCount),
        'object': randomRangeGetter(data.particleCount),
        'undefined': constant(60),
        'function': data.particleCount
    }[typeof data.particleCount];
    var particleCount = getParticleCount();
    /*var particleCount =
     typeof data.particleCount === 'number'
      ? data.particleCount
      : typeof data.particleCount === 'object'
       ? randint(data.particleCount[0], data.particleCount[1])
       : 60;*/
    var depth = data.depth !== void 0 ? data.depth : 1;
    var sizeCoeff = data.sizeCoeff !== void 0 ? data.sizeCoeff : 1;
    var lifeCoeff = data.lifeCoeff !== void 0 ? data.lifeCoeff : 1;
    var velocityCoeff = data.velocityCoeff !== void 0 ? data.velocityCoeff : 1;
    var particleCountCoeff = data.particleCountCoeff !== void 0 ? data.particleCountCoeff : 1;
    var dieInFlash = function (x, y, oldVx, oldVy) {
        fireworks.addParticle(x, y, COLOR_WHITE, 3, 1.5, 0, 0, -20);
        var sparklesCount = 4 + (Math.random() * 3) | 0;
        for (var i = 0; i < sparklesCount; ++i) {
            var angle = (Math.random() - 0.5) * Math.PI * 2;
            var vx = oldVx / 3 + Math.cos(angle) * 10;
            var vy = oldVy / 3 + Math.sin(angle) * 10;
            fireworks.addParticle(x, y, COLOR_WHITE, 2, 2, vx, vy, -5);
        }
    };
    var childCallback = depth < 2 ? dieInFlash : function (x, y, vx, vy) {
        spawnExplosion(fireworks, {
            x: x, y: y,
            color: getNewParticleColor,
            vs: getNewParticleVS,
            size: multiplyFn(sizeCoeff, getNewParticleSize),
            life: multiplyFn(lifeCoeff, getNewParticleLife),
            velocity: multiplyFn(velocityCoeff, getNewParticleV),
            velocityAddition: [vx / 2, vy / 2],
            particleCount: multiplyFn(particleCountCoeff, getParticleCount),
            depth: depth - 1,
            lifeCoeff: data.lifeCoeff,
            particleCountCoeff: data.particleCountCoeff,
            sizeCoeff: data.sizeCoeff,
            velocityCoeff: data.velocityCoeff
        });
    };
    var angleBetween = (Math.PI * 2) / particleCount;
    for (var i = 0; i < particleCount; ++i) {
        var x = getNewParticleX();
        var y = getNewParticleY();
        var vs = getNewParticleVS();
        var velocityAddition = getNewParticleVelocityAddition();
        var vx = Math.cos(i * angleBetween) * getNewParticleV() + velocityAddition[0];
        var vy = Math.sin(i * angleBetween) * getNewParticleV() + velocityAddition[1];
        var size = getNewParticleSize();
        var color = getNewParticleColor();
        var life = getNewParticleLife();
        fireworks.addParticle(x, y, color, size, life, vx, vy, vs, childCallback);
    }
}
function spawnBall(fireworks, centerX, centerY, radius, particleCount) {
    if (particleCount === void 0) { particleCount = 30; }
    for (var i = 0; i < particleCount; ++i) {
        var randomAngle = Math.random() * Math.PI * 2;
        var randomDistance = Math.random() * radius;
        var x = centerX + Math.cos(randomAngle) * randomDistance;
        var y = centerY + Math.sin(randomAngle) * randomDistance;
        fireworks.addParticle(x, y, COLOR_WHITE, 3, 2.8 + Math.random(), Math.random() * 10 - 5, -100, -1);
    }
}
var FireworkShell = (function () {
    function FireworkShell(power, color, life, subshells) {
        this.power = power;
        this.color = color;
        this.life = life;
        this.subshells = subshells;
    }
    return FireworkShell;
}());
function fireFromTo(fireworks, startPos, endPos, arrivalTime, color, size, vs, callback) {
    if (vs === void 0) { vs = size / arrivalTime; }
    var dx = endPos[0] - startPos[0];
    var dy = endPos[1] - startPos[1];
    var distance = Math.sqrt(dx * dx + dy * dy);
    var dxNorm = dx / distance;
    var dyNorm = dy / distance;
    var vx = dxNorm * (distance / arrivalTime);
    //var vy = dyNorm * (distance / arrivalTime);
    var vy = (-10 * arrivalTime * arrivalTime - startPos[1] + endPos[1]) / arrivalTime;
    var life = arrivalTime;
    fireworks.addParticle(startPos[0], startPos[1], color, size, life, vx, vy, vs, callback);
}
function fireFromToExplosion(fireworks, startPos, endPos, arrivalTime, endBurstSize) {
    var explosionParticleSize = 1.0;
    var explosionTime = 1.0;
    var explosionParticleVelocity = endBurstSize / explosionTime;
    var explosionLife = explosionTime * 2;
    var explosionVs = -explosionParticleSize / explosionLife / 2;
    var callback = function (x, y) {
        spawnExplosion(fireworks, {
            x: x,
            y: y,
            life: [explosionLife / 2, explosionLife * 2],
            velocity: explosionParticleVelocity,
            size: explosionParticleSize,
            particleCount: 10,
            depth: 0,
            color: COLOR_PURPLE,
            vs: explosionVs
        });
    };
    var size = 1.0;
    var dx = endPos[0] - startPos[0];
    var dy = endPos[1] - startPos[1];
    var distance = Math.sqrt(dx * dx + dy * dy);
    var dxNorm = dx / distance;
    var dyNorm = dy / distance;
    var vx = dxNorm * (distance / arrivalTime);
    //var vy = dyNorm * (distance / arrivalTime);
    var vy = (-10 * arrivalTime * arrivalTime - startPos[1] + endPos[1]) / arrivalTime;
    var life = arrivalTime;
    var vs = size / arrivalTime;
    fireworks.addParticle(startPos[0], startPos[1], COLOR_GREEN, 1, life, vx, vy, vs, callback);
}
function getRandomHeartPoint(canvasSize) {
    var angle = Math.random() * Math.PI * 2;
    //var radius = Math.random() * 100;
    //var radius = (1 - Math.sin(angle)) * 100;
    /*return [
        (canvasSize[0] / 2) + Math.cos(angle) * radius,
        (canvasSize[1] / 2) - Math.sin(angle) * radius
    ];*/
    var t = Math.random() * Math.PI * 2;
    var cx = (canvasSize[0] / 2);
    var cy = (canvasSize[1] / 2);
    var rawX = 16 * Math.pow(Math.sin(t), 3);
    var rawY = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    var x = cx + rawX * 10;
    var y = cy - rawY * 10 - 50;
    return [x, y];
}
function fireShell(fireworks, pos, velocity, shell) {
    var fireSubshell = function (x, y, vx, vy) {
        for (var i = 0; i < shell.subshells.length; ++i) {
            var subshell = shell.subshells[i][0];
            var subshellPos = shell.subshells[i][1];
            var mag = Math.sqrt(subshellPos[0] * subshellPos[0] + subshellPos[1] * subshellPos[1]);
            var dx = subshellPos[0] / mag;
            var dy = subshellPos[1] / mag;
            fireShell(fireworks, [x, y], [vx + dx * shell.power, vy + dy * shell.power], subshell);
        }
    };
    fireworks.addParticle(pos[0], pos[1], shell.color, 3, shell.life, velocity[0], velocity[1], -(3 / shell.life), fireSubshell);
}
function main() {
    var DISPLAY_WIDTH = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    var DISPLAY_HEIGHT = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    var display = createCanvas(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    console.log(DISPLAY_WIDTH, DISPLAY_HEIGHT, display.width, display.height);
    document.body.appendChild(display);
    var ctx = display.getContext('2d');
    var fireworks = new Fireworks([0, DISPLAY_WIDTH, DISPLAY_HEIGHT, 0], [0, 20]);
    function sceneA(fireworks) {
        var speed = -400;
        var life = DISPLAY_HEIGHT * 0.7 / Math.abs(speed);
        playLongFlight();
        fireworks.addParticle(DISPLAY_WIDTH / 2.0, DISPLAY_HEIGHT, COLOR_YELLOW, 3, life, 0, speed, -1, function (x, y, vx, vy) {
            playBang();
            setTimeout(playSparkles, 2840);
            spawnExplosion(fireworks, { x: x, y: y, color: [COLOR_YELLOW, COLOR_ORANGE], particleCount: 100 });
        });
    }
    function sceneB(fireworks) {
        var count = 3;
        var xPadding = DISPLAY_WIDTH * 0.2;
        var xStart = xPadding;
        var xEnd = DISPLAY_WIDTH - xPadding;
        var xStep = (xEnd - xStart) / Math.max(1, count - 1);
        var speed = -400;
        var life = DISPLAY_HEIGHT * 0.7 / Math.abs(speed);
        function setParticleTimeout(i) {
            var colors = {
                '0': [COLOR_GREEN, COLOR_WHITE],
                '1': [COLOR_VIOLET, COLOR_PURPLE],
                '2': [COLOR_BLUE, COLOR_CYAN]
            }[(i % count).toString()];
            setTimeout(function () {
                playLongFlight();
                fireworks.addParticle(xStart + i * xStep, DISPLAY_HEIGHT, colors[0], 3, life, 0, speed, -1, function (x, y, vx, vy) {
                    playBang();
                    setTimeout(playSparkles, 2840);
                    spawnExplosion(fireworks, { x: x, y: y, color: colors, particleCount: 100 });
                });
            }, i * 400);
        }
        for (var i = 0; i < count; ++i) {
            setParticleTimeout(i);
        }
    }
    function sceneC(fireworks) {
        var count = 3;
        var xPadding = DISPLAY_WIDTH * 0.2;
        var xStart = xPadding;
        var xEnd = DISPLAY_WIDTH - xPadding;
        var xStep = (xEnd - xStart) / Math.max(1, count - 1);
        var speed = -500;
        var life = DISPLAY_HEIGHT * 0.7 / Math.abs(speed);
        function setParticleTimeout(i) {
            var colors = {
                '0': [COLOR_RED, COLOR_ORANGE],
                '1': [COLOR_BLUE, COLOR_CYAN],
                '2': [COLOR_ORANGE, COLOR_YELLOW]
            }[(i % count).toString()];
            setTimeout(function () {
                playLongFlight();
                fireworks.addParticle(xStart + i * xStep, DISPLAY_HEIGHT, colors[0], 3, life, 0, speed, -1, function (x, y, vx, vy) {
                    setTimeout(playBang, Math.floor(Math.random() * 100));
                    setTimeout(playSparkles, 2840 + Math.floor(Math.random() * 100));
                    spawnExplosion(fireworks, { x: x, y: y, color: colors, particleCount: 100 });
                });
            }, 0);
        }
        for (var i = 0; i < count; ++i) {
            setParticleTimeout(i);
        }
    }
    function sceneD(fireworks) {
        var cx = DISPLAY_WIDTH / 2;
        var speed = -400;
        var life = DISPLAY_HEIGHT * 0.7 / Math.abs(speed);
        playLongFlight();
        fireworks.addParticle(cx, DISPLAY_HEIGHT, COLOR_GREEN, 3, life, 0, speed, -1, function (x, y, vx, vy) {
            playBang();
            setTimeout(playBang, 2700);
            setTimeout(playBang, 2710);
            setTimeout(playBang, 2800);
            setTimeout(playBang, 2850);
            setTimeout(playBang, 2900);
            setTimeout(playSparkles, 5300);
            setTimeout(playSparkles, 5350);
            spawnExplosion(fireworks, { depth: 2, x: x, y: y, color: [COLOR_GREEN, COLOR_CYAN], particleCount: 60, particleCountCoeff: 0.3 });
        });
        playLongFlight();
        fireworks.addParticle(cx - DISPLAY_WIDTH / 4, DISPLAY_HEIGHT, COLOR_GREEN, 3, life * 1.5, 0, speed / 1.5, -1, function (x, y, vx, vy) {
            setTimeout(playBang, Math.floor(Math.random() * 100));
            setTimeout(playSparkles, 1300 + Math.floor(Math.random() * 100));
            spawnExplosion(fireworks, { x: x, y: y, color: [COLOR_GREEN, COLOR_CYAN], particleCount: 60, size: 2, vs: -1, life: [1.2, 1.8] });
        });
        playLongFlight();
        fireworks.addParticle(cx + DISPLAY_WIDTH / 4, DISPLAY_HEIGHT, COLOR_GREEN, 3, life * 1.5, 0, speed / 1.5, -1, function (x, y, vx, vy) {
            setTimeout(playBang, Math.floor(Math.random() * 100));
            setTimeout(playSparkles, 1300 + Math.floor(Math.random() * 100));
            spawnExplosion(fireworks, { x: x, y: y, color: [COLOR_GREEN, COLOR_CYAN], particleCount: 60, size: 2, vs: -1, life: [1.2, 1.8] });
        });
    }
    function sceneE(fireworks) {
        var cx = DISPLAY_WIDTH / 2;
        var speed = -400;
        var life = DISPLAY_HEIGHT * 0.7 / Math.abs(speed);
        playShortFlight();
        fireworks.addParticle(cx, DISPLAY_HEIGHT, COLOR_VIOLET, 5, life, 0, speed, -1, function (x, y, vx, vy) {
            playBang();
            setTimeout(playBang, 2600);
            setTimeout(playBang, 2630);
            setTimeout(playBang, 2700);
            setTimeout(playBang, 4410);
            setTimeout(playBang, 4430);
            setTimeout(playBang, 4500);
            setTimeout(playSparkles, 5800);
            setTimeout(playSparkles, 5900);
            spawnExplosion(fireworks, {
                depth: 3,
                x: x,
                y: y,
                color: [COLOR_VIOLET, COLOR_PURPLE],
                particleCount: 60,
                particleCountCoeff: 0.2,
                lifeCoeff: 0.7,
                sizeCoeff: 0.7
            });
        });
    }
    function sceneF(fireworks) {
        var cx = DISPLAY_WIDTH / 2;
        var cy = DISPLAY_HEIGHT / 2;
        playShortFlight();
        setTimeout(playSparkles, 2000);
        setTimeout(playSparkles, 4000);
        setTimeout(playSparkles, 6000);
        fireFromTo(fireworks, [cx, DISPLAY_HEIGHT], [cx, cy + cy / 2], 2, COLOR_GREEN, 3, -1, function (x, y) {
            spawnExplosion(fireworks, { x: x, y: y, color: COLOR_WHITE, particleCount: 30, velocity: [5, 20], life: [0.8, 1.5] });
            playShortFlight();
            fireFromTo(fireworks, [x, y], [cx, cy], 2, COLOR_GREEN, 3, -1, function (x, y) {
                spawnExplosion(fireworks, { x: x, y: y, color: COLOR_WHITE, particleCount: 30, velocity: [5, 20], life: [0.8, 1.5] });
                playShortFlight();
                fireFromTo(fireworks, [x, y], [cx, cy - cy / 2], 2, COLOR_GREEN, 3, -1, function (x, y) {
                    spawnExplosion(fireworks, { x: x, y: y, color: COLOR_WHITE, particleCount: 30, velocity: [5, 20], life: [0.8, 1.5] });
                    playBang();
                    setTimeout(playBang, 2800);
                    setTimeout(playBang, 2810);
                    setTimeout(playBang, 2900);
                    setTimeout(playBang, 2850);
                    setTimeout(playSparkles, 5250);
                    setTimeout(playSparkles, 5300);
                    spawnExplosion(fireworks, { x: x, y: y, color: [COLOR_GREEN, COLOR_YELLOW], depth: 2, particleCountCoeff: 0.5, velocityCoeff: 1.2 });
                });
            });
        });
    }
    function sceneFinal(fireworks) {
        var explosionParticleSize = 2.0;
        var explosionTime = 1.0;
        var explosionParticleVelocity = 10 / explosionTime;
        var explosionLife = explosionTime * 2;
        var explosionVs = -explosionParticleSize / explosionLife / 2;
        function explosion(x, y) {
            spawnExplosion(fireworks, {
                x: x, y: y,
                color: [COLOR_PURPLE, COLOR_VIOLET, COLOR_BLUE]
            });
            setTimeout(playBang, Math.random() * 100);
            setTimeout(playLongFlight, 80);
            setTimeout(playShortFlight, 10);
            for (var i = 0; i < 40; ++i) {
                fireFromTo(fireworks, [x, y], getRandomHeartPoint([DISPLAY_WIDTH, DISPLAY_HEIGHT]), 4, COLOR_PURPLE, 3, -3 / 8, function (x, y) {
                    spawnExplosion(fireworks, {
                        x: x, y: y,
                        life: [explosionLife / 2, explosionLife * 2],
                        velocity: explosionParticleVelocity,
                        size: explosionParticleSize,
                        particleCount: 5,
                        depth: 0,
                        color: COLOR_PURPLE,
                        vs: explosionVs
                    });
                });
            }
        }
        setTimeout(playSparkles, 6000 + 3000);
        setTimeout(playSparkles, 6000 + 3200);
        setTimeout(playSparkles, 6000 + 5250);
        setTimeout(playSparkles, 6000 + 5500);
        setTimeout(playSparkles, 6000 + 6000);
        setTimeout(playSparkles, 6000 + 6700);
        var cx = DISPLAY_WIDTH / 2;
        var cy = DISPLAY_HEIGHT / 2;
        var padding = 0.2;
        playShortFlight();
        fireFromTo(fireworks, [cx, DISPLAY_HEIGHT], [cx, cy], 3, COLOR_CYAN, 5, -1, function (x, y) {
            setTimeout(playLongFlight, 80);
            setTimeout(playLongFlight, 90);
            setTimeout(playLongFlight, 40);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * padding * 0.8, DISPLAY_HEIGHT * padding * 0.8], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [cx, DISPLAY_HEIGHT * 0.2], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * (1 - padding * 0.8), DISPLAY_HEIGHT * padding * 0.8], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * padding * 1.2, cy], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * (1 - padding * 1.2), cy], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * padding * 0.8, DISPLAY_HEIGHT * (1 - padding * 0.8)], 3, COLOR_CYAN, 3, -1, explosion);
            fireFromTo(fireworks, [x, y], [DISPLAY_WIDTH * (1 - padding * 0.8), DISPLAY_HEIGHT * (1 - padding * 0.8)], 3, COLOR_CYAN, 3, -1, explosion);
        });
    }
    var scenes = [
        [5000, sceneA],
        [7000, sceneB],
        [5000, sceneC],
        [9000, sceneD],
        [9000, sceneE],
        [14000, sceneF],
        [12000, sceneFinal]
    ];
    var calcSceneDelay = function (i) {
        return i < 1
            ? 200
            : scenes[i - 1][0] + calcSceneDelay(i - 1);
    };
    var setSceneTimeout = function (i) {
        setTimeout(function () {
            scenes[i][1](fireworks);
        }, calcSceneDelay(i));
    };
    for (var i = 0; i < scenes.length; ++i) {
        setSceneTimeout(i);
    }
    display.addEventListener('click', function (event) {
        console.log('click!');
        var endX = (event.clientX - display.offsetLeft) / (display.offsetWidth > 0 ? display.offsetWidth : display.width) * display.width;
        var endY = (event.clientY - display.offsetTop) / (display.offsetHeight > 0 ? display.offsetHeight : display.height) * display.height;
        var padding = DISPLAY_WIDTH * 0.3;
        var startX = Math.random() * (DISPLAY_WIDTH - padding * 2) + padding;
        var startY = DISPLAY_HEIGHT;
        var colors = [
            COLOR_BLUE,
            COLOR_CYAN,
            COLOR_GREEN,
            COLOR_ORANGE,
            COLOR_PURPLE,
            COLOR_YELLOW,
            [COLOR_BLUE, COLOR_CYAN],
            [COLOR_BLUE, COLOR_WHITE],
            [COLOR_BLUE, COLOR_PURPLE],
            [COLOR_BLUE, COLOR_PURPLE, COLOR_VIOLET],
            [COLOR_GREEN, COLOR_CYAN],
            [COLOR_GREEN, COLOR_WHITE],
            [COLOR_GREEN, COLOR_YELLOW],
            [COLOR_CYAN, COLOR_WHITE],
            [COLOR_CYAN, COLOR_YELLOW],
            [COLOR_PURPLE, COLOR_VIOLET],
            [COLOR_PURPLE, COLOR_WHITE],
            [COLOR_YELLOW, COLOR_RED],
            [COLOR_YELLOW, COLOR_ORANGE],
            [COLOR_YELLOW, COLOR_ORANGE, COLOR_RED]
        ];
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size = Math.random() * 3 + 2;
        var time = 1 + Math.random();
        playShortFlight();
        setTimeout(playBang, time * 1000);
        setTimeout(playSparkles, time * 1000 + 2800);
        fireFromTo(fireworks, [startX, startY], [endX, endY], time, typeof color === 'number' ? color : color[0], size, -0.1, function (x, y) {
            spawnExplosion(fireworks, {
                x: x, y: y,
                color: color
            });
        });
    });
    ctx.fillStyle = '#100030';
    //ctx.globalCompositeOperation = 'lighter';
    ctx.fillRect(0, 0, display.width, display.height);
    var lastTime = +new Date();
    var lastFrame = 0;
    var update = function () {
        var currentTime = +new Date();
        var dt = (currentTime - lastTime) / 1000;
        if (dt > 0.25)
            dt = 0.25;
        lastTime = currentTime;
        fireworks.update(dt);
        if (lastFrame++ % 2 === 0) {
            //ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#100030';
            ctx.fillRect(0, 0, display.width, display.height);
            //ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 1.0;
        }
        fireworks.render(ctx);
        setTimeout(update, 1);
    };
    setTimeout(update, 0);
}
var onLoad = function (event) {
    clearTimeout(onLoadTimeout);
    document.removeEventListener("DOMContentLoaded", onLoad);
    main();
};
var onLoadTimeout = setTimeout(onLoad, 1000);
document.addEventListener("DOMContentLoaded", onLoad);
