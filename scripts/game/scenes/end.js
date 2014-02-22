(function () {

	var title = new Facade.Text({
		y: 250,
		value: 'Well shit, you got betrayed by your own mind.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 40,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	}),
	click_to_continue = new Facade.Text({
		y: 500,
		value: 'Click to try again. If you must.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 30,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	});

	BETRAYAL.scenes.end = {

		click: function () {

			BETRAYAL.active_scene = BETRAYAL.scenes.intro;

		},

		draw: function () {

			this.addToStage(title);
			this.addToStage(click_to_continue);

		},

		keydown: function () {

		}

	};

	// BETRAYAL.active_scene = BETRAYAL.scenes.end;

}());