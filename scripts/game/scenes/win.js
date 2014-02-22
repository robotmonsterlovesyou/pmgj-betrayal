(function () {

	var title = new Facade.Text({
		y: 300,
		value: 'Strange, there are no more levels.\nPerhaps the developer got mauled by a large angry bear.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 40,
		lineHeight: 55,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	}),
	click_to_continue = new Facade.Text({
		y: 500,
		value: 'Click to play again. If you must.',
		width: BETRAYAL.stage.width(),
		textAlign: 'center',
		fontSize: 30,
		fontFamily: 'Helvetica Neue',
		fillStyle: '#fff'
	});

	BETRAYAL.scenes.win = {

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