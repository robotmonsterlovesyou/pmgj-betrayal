Facade.Box2d = function (width, height, gravity, sleep) {

	if (!(gravity instanceof Box2D.Common.Math.b2Vec2)) {

		gravity = new Box2D.Common.Math.b2Vec2(0, 20);

	}

	if (String(typeof sleep) === 'undefined') {

		sleep = true;

	}

	this.world = new Box2D.Dynamics.b2World(gravity, sleep);

	this.shapes = [];

	this.bounds = {};

	this.debug = null;

	this.scale = 30;

	this.bounds.top = this.addObject(new Facade.Rect({ x: 0, y: -1, height: 1, width: width }), { friction: 0 });
	this.bounds.right = this.addObject(new Facade.Rect({ x: width, y: 0, height: height, width: 1 }), { friction: 0 });
	this.bounds.bottom = this.addObject(new Facade.Rect({ x: 0, y: height, height: 1, width: width }), { friction: 1 });
	this.bounds.left = this.addObject(new Facade.Rect({ x: -1, y: 0, height: height, width: 1 }), { friction: 0 });

};

Facade.Box2d.prototype.addObject = function (obj, settings, type) {

	var body = new Box2D.Dynamics.b2BodyDef(),
		fixture = new Box2D.Dynamics.b2FixtureDef(),
		options,
		metrics;

	if (obj instanceof Facade.Entity) {

		options = obj.getAllOptions();
		metrics = obj.getAllMetrics();

		body.position = new Box2D.Common.Math.b2Vec2(
			(metrics.x + (metrics.width / 2)) / this.scale,
			(metrics.y + (metrics.height / 2)) / this.scale
		);

		body.fixedRotation = settings.rotate || true;

		if (!type || type === 'static') {

			body.type = Box2D.Dynamics.b2Body.b2_staticBody;

		} else if (type === 'dynamic') {

			body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

		} else if (type === 'kinematic') {

			body.type = Box2D.Dynamics.b2Body.b2_kinematicBody;

		}

		body.userData = obj;

		fixture.density = settings.density || 1.0;
		fixture.friction = settings.friction || 0.1;
		fixture.restitution = settings.restitution || 0.1;

		if (obj instanceof Facade.Rect) {

			fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
			fixture.shape.SetAsBox((obj.getMetric('width') / this.scale) / 2, (obj.getMetric('height') / this.scale) / 2);

			this.world.CreateBody(body).CreateFixture(fixture);

		}

		this.shapes.push(this.world.m_bodyList);

		return this.world.m_bodyList;

	}

	return false;

};

Facade.Box2d.prototype.removeObject = function (obj) {

	var index = this.shapes.indexOf(obj);

	if (index) {

		this.shapes.splice(index, 1);

	}

	this.world.DestroyBody(obj);

	obj.m_userData = null;

};

Facade.Box2d.prototype.testCollision = function (obj, against) {

	var current = obj.GetContactList(),
		contacts = [];

	while (current) {

		contacts.push(current.contact.m_fixtureB.m_body);

		current = current.contact.next;

	}

	return contacts.indexOf(against) !== -1;

};

Facade.Box2d.prototype.getObjectOptions = function (obj) {

	var options = { x: null, y: null, rotate: null },
		metrics;

	if (obj.hasOwnProperty('m_fixtureList')) {

		metrics = obj.m_userData.getAllMetrics();

		options.x = (obj.m_fixtureList.m_body.m_xf.position.x) * this.scale - (metrics.width / 2);
		options.y = (obj.m_fixtureList.m_body.m_xf.position.y) * this.scale - (metrics.height / 2);

		options.rotate = obj.GetAngle() * (180 / Math.PI);

	}

	return options;

};

Facade.Box2d.prototype.step = function () {

	this.world.Step(1 / 60, 6, 3);

};

Facade.Box2d.prototype.debugDraw = function (facade) {

	if (!this.debug) {

		this.debug = new Box2D.Dynamics.b2DebugDraw();
		this.debug.SetSprite(facade.context);
		this.debug.SetDrawScale(this.scale);
		this.debug.SetFillAlpha(0.3);
		this.debug.SetLineThickness(1.0);
		this.debug.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit);
		this.world.SetDebugDraw(this.debug);

	}

	this.world.DrawDebugData();

};