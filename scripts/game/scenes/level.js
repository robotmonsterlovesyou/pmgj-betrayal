(function () {

	'use strict';

	var hud_info = new Facade.Text({
		x: 50,
		y: 20,
		value: 'Deaths: {} Level: {}',
		fontSize: 20,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	}),

	map = [],

	player = null,
	timeout = null,
	display_map = true,
	moving_platforms = [],

	ghost_iteration = 0,

	current_ghost = [],

	ghosts = [];

	if (window.localStorage.getItem('ghosts')) {

		ghosts = JSON.parse(window.localStorage.getItem('ghosts'));

	}

	BETRAYAL.stats.deaths = ghosts.length;

	player = BETRAYAL.world.addObject(new Facade.Rect({
		x: 120, y: -100,
		width: 60, height: 70,
		fillStyle: '#eee'
	}), { restitution: 0.1, friction: 0.5 }, 'dynamic');

	BETRAYAL.scenes.level = {

		click: function () {

		},

		draw: function () {

			var item,
				hud_info_value,
				options,
				platform,
				ghost,
				ghost_was_drawn = false;

			hud_info_value = hud_info.getOption('value').sprintf(BETRAYAL.stats.deaths, BETRAYAL.stats.level);

			this.addToStage(hud_info, { value: hud_info_value });

			if (map.length) {

				BETRAYAL.world.step();

				ghost_iteration++;

				if (player) {

					this.addToStage(player.m_userData, BETRAYAL.world.getObjectOptions(player));

					ghost = BETRAYAL.world.getObjectOptions(player);

					ghost.x = Math.round(ghost.x);
					ghost.y = Math.round(ghost.y);
					delete ghost.rotate;

					current_ghost.push(ghost);

				}

				for (ghost in ghosts) {

					if (ghosts.hasOwnProperty(ghost) && ghosts[ghost][ghost_iteration]) {

						ghosts[ghost][ghost_iteration].opacity = 75;

						this.addToStage(player.m_userData, ghosts[ghost][ghost_iteration]);

						ghost_was_drawn = true;

					}

				}

				if (!ghost_was_drawn) {

					ghost_iteration = 0;

				}

				if (display_map) {

					for (item in map) {

						if (map.hasOwnProperty(item)) {

							options = BETRAYAL.world.getObjectOptions(map[item].obj);

							this.addToStage(map[item].obj.m_userData, options);

						}

					}

				}

				for (platform in moving_platforms) {

					if (moving_platforms.hasOwnProperty(platform)) {

						if (!moving_platforms[platform].animate_direction) {

							moving_platforms[platform].animate_direction = 'forward';

						}

						if (!moving_platforms[platform].platform.horizontal_speed) {

							moving_platforms[platform].platform.horizontal_speed = 0;

						}

						if (!moving_platforms[platform].platform.vertical_speed) {

							moving_platforms[platform].platform.vertical_speed = 0;

						}

						if (moving_platforms[platform].animate_direction === 'backward') {

							moving_platforms[platform].obj.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(-moving_platforms[platform].platform.horizontal_speed, -moving_platforms[platform].platform.vertical_speed), moving_platforms[platform].obj.GetWorldCenter());

							if (BETRAYAL.world.getObjectOptions(moving_platforms[platform].obj).x < moving_platforms[platform].x + moving_platforms[platform].platform.left) {

								moving_platforms[platform].animate_direction = 'forward';

							} else if (BETRAYAL.world.getObjectOptions(moving_platforms[platform].obj).y < moving_platforms[platform].y + moving_platforms[platform].platform.top) {

								moving_platforms[platform].animate_direction = 'forward';

							}

						} else if (moving_platforms[platform].animate_direction === 'forward') {

							moving_platforms[platform].obj.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(moving_platforms[platform].platform.horizontal_speed, moving_platforms[platform].platform.vertical_speed), moving_platforms[platform].obj.GetWorldCenter());

							if (BETRAYAL.world.getObjectOptions(moving_platforms[platform].obj).x > moving_platforms[platform].x + moving_platforms[platform].platform.right) {

								moving_platforms[platform].animate_direction = 'backward';

							} else if (BETRAYAL.world.getObjectOptions(moving_platforms[platform].obj).y > moving_platforms[platform].y + moving_platforms[platform].platform.bottom) {

								moving_platforms[platform].animate_direction = 'backward';

							}

						}

					}

				}

				if (timeout === null) {

					timeout = setTimeout(function () {

						display_map = false;

					}, 5000);

				}

				if (BETRAYAL.world.testCollision(player, BETRAYAL.world.bounds.bottom)) {

					ghosts.push(current_ghost);

					window.localStorage.setItem('ghosts', JSON.stringify(ghosts));

					current_ghost = [];

					ghost_iteration = 0;

					if (BETRAYAL.debug) {

						BETRAYAL.scenes.level.reset();

					} else {

						BETRAYAL.stats.deaths = ghosts.length;

						BETRAYAL.scenes.level.reset();

					}

				} else if (BETRAYAL.world.testCollision(player, BETRAYAL.world.bounds.right)) {

					if (BETRAYAL.debug) {

						BETRAYAL.scenes.level.load('data/maps/level{}.json'.sprintf(BETRAYAL.stats.level));

					} else {

						if (BETRAYAL.stats.level < BETRAYAL.levels) {

							BETRAYAL.stats.level = BETRAYAL.stats.level + 1;

							BETRAYAL.scenes.level.load('data/maps/level{}.json'.sprintf(BETRAYAL.stats.level));

						} else {

							BETRAYAL.active_scene = BETRAYAL.scenes.win;

						}

					}

				}

			}

			if (BETRAYAL.debug) {

				BETRAYAL.world.debugDraw(this);

			}

		},

		load: function (url) {

			var http = new XMLHttpRequest(),
				item;

			BETRAYAL.scenes.level.reset();

			for (item in map) {

				if (map.hasOwnProperty(item)) {

					BETRAYAL.world.removeObject(map[item].obj);

				}

			}

			map = [];

			moving_platforms = [];

			http.onreadystatechange = function () {

				var data,
					item;

				if (http.readyState === 4 && http.status === 200) {

					data = JSON.parse(http.responseText);

					map = data;

					for (item in map) {

						if (map.hasOwnProperty(item)) {

							if (!map[item].friction) map[item].friction = 1;
							if (!map[item].restitution) map[item].restitution = 0.1;

							if (map[item].hasOwnProperty('platform')) {

								map[item].obj = BETRAYAL.world.addObject(new Facade.Rect(map[item]), {
									friction: map[item].friction,
									restitution: map[item].restitution
								}, 'kinematic');

								moving_platforms.push(map[item]);

							} else {

								map[item].obj = BETRAYAL.world.addObject(new Facade.Rect(map[item]), {
									friction: map[item].friction,
									restitution: map[item].restitution
								}, 'static');

							}

						}

					}

				}

			};

			http.open('GET', url);
			http.send();

		},

		keydown: function () {

			var velocity = player.m_linearVelocity,
				speed = 5;

			if (BETRAYAL.active_keys.indexOf(37) !== -1) {

				if (velocity.x > 0) {

					velocity.x = 0;

				} else {

					velocity.x = -speed;

				}

				player.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(velocity.x, velocity.y), player.GetWorldCenter());

			} else if (BETRAYAL.active_keys.indexOf(39) !== -1) {

				if (velocity.x < 0) {

					velocity.x = 0;

				} else {

					velocity.x = speed;

				}

				player.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(velocity.x, velocity.y), player.GetWorldCenter());

			}

			if (BETRAYAL.active_keys.indexOf(32) !== -1 && velocity.y === 0) {

				player.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(velocity.x, -15), player.GetWorldCenter());

			}

		},

		reset: function () {

			BETRAYAL.world.removeObject(BETRAYAL.world.bounds.top);

			player.SetPosition(new Box2D.Common.Math.b2Vec2((120 + 30) / 30, (-100 + 35) / 30));
			player.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0), player.GetWorldCenter());

			clearTimeout(timeout);

			timeout = null;
			display_map = true;

			BETRAYAL.active_keys = [];

		}

	};

	if (BETRAYAL.debug) {

		BETRAYAL.active_scene = BETRAYAL.scenes.level;

		BETRAYAL.stats.level = parseInt(BETRAYAL.debug, 10);

		BETRAYAL.scenes.level.load('data/maps/level{}.json'.sprintf(BETRAYAL.stats.level));

	}

}());