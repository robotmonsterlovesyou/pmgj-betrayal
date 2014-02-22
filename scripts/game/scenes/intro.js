(function () {

	var title = new Facade.Text({
		y: 250,
		value: 'BETRAYAL',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 100,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	}),
	tagline = new Facade.Text({
		y: 380,
		value: 'There is one enemy out there that you shouldn\'t kill.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 30,
		fontFamily: 'Helvetica Neue',
		fontStyle: 'italic',
		fillStyle: '#fff'
	}),
	click_to_continue = new Facade.Text({
		y: 500,
		value: 'Click anywhere to face that enemy.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 30,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	}),

	player = new Facade.Rect({
		x: 120, y: -100,
		width: 60, height: 70,
		fillStyle: '#eee'
	}),

	ghost_iteration = 0,
	ghosts = [];

	if (window.localStorage.getItem('ghosts')) {

		ghosts = JSON.parse(window.localStorage.getItem('ghosts'));

	}

	BETRAYAL.scenes.intro = {

		click: function () {

			if (BETRAYAL.levels) {

				BETRAYAL.active_scene = BETRAYAL.scenes.level;

				BETRAYAL.stats.level = 1;

				BETRAYAL.scenes.level.load('data/maps/level{}.json'.sprintf(BETRAYAL.stats.level));

			} else {

				BETRAYAL.active_scene = BETRAYAL.scenes.win;

			}

		},

		draw: function () {

			var ghost,
				ghost_was_drawn = false;

			ghost_iteration = ghost_iteration + 1;

			this.addToStage(title);
			this.addToStage(tagline);
			this.addToStage(click_to_continue);

			for (ghost in ghosts) {

				if (ghosts.hasOwnProperty(ghost) && ghosts[ghost][ghost_iteration]) {

					ghosts[ghost][ghost_iteration].opacity = 25;

					this.addToStage(player, ghosts[ghost][ghost_iteration]);

					ghost_was_drawn = true;

				}

			}

			if (!ghost_was_drawn) {

				ghost_iteration = 0;

			}

		},

		keydown: function () {

		}

	};

	BETRAYAL.active_scene = BETRAYAL.scenes.intro;

}());