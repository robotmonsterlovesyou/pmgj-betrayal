var BETRAYAL = {
	scenes: {},
	active_scene: null,
	active_keys: [],
	stats: {
		deaths: 0,
		level: 0
	},
	levels: 2,
	world: null,
	debug: false
};

(function () {

	var stage = document.querySelector('#stage'),
		interval = null;

	BETRAYAL.stage = new Facade(stage);
	BETRAYAL.ghost_stage = new Facade(document.querySelector('#ghost_stage'));

	BETRAYAL.world = new Facade.Box2d(BETRAYAL.stage.width(), BETRAYAL.stage.height(), [0, 20], false);

	BETRAYAL.stage.draw(function () {

		this.clear();

		if (BETRAYAL.active_scene && BETRAYAL.active_scene.hasOwnProperty('draw')) {

			BETRAYAL.active_scene.draw.call(this);

		}

	});

	stage.addEventListener('click', function (e) {

		e.preventDefault();

		if (BETRAYAL.active_scene.hasOwnProperty('click')) {

			BETRAYAL.active_scene.click.call();

		}

	});

	document.addEventListener('keydown', function (e) {

		if (BETRAYAL.active_keys.indexOf(e.keyCode) === -1) {

			BETRAYAL.active_keys.push(e.keyCode);

		}

	});

	document.addEventListener('keyup', function (e) {

		if (BETRAYAL.active_keys.indexOf(e.keyCode) !== -1) {

			BETRAYAL.active_keys.splice(BETRAYAL.active_keys.indexOf(e.keyCode), 1);

		}

	});

	interval = setInterval(function () {

		if (document.webkitHidden) {

			BETRAYAL.active_keys = [];

		}

		if (BETRAYAL.active_scene.hasOwnProperty('keydown')) {

			BETRAYAL.active_scene.keydown.call();

		}

	}, 100);

}());