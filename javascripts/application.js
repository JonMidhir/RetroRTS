// Generated by CoffeeScript 1.4.0
(function() {
  var Bomb, CircularFrame, Core, Entity, Map, RectangularFrame, Soldier, Vector, Vertex,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Core = (function() {

    function Core(attributes) {
      var defaults;
      if (attributes == null) {
        attributes = {};
      }
      this.getFrame = __bind(this.getFrame, this);

      this.entities = [];
      this.entityCount = 0;
      this.frameCount = 0;
      defaults = {
        fps: 60,
        viewport: document
      };
      _.extend(defaults, attributes);
      this.attributes = defaults;
      this.el = this.attributes.viewport;
      this.$el = $(this.el);
      this;

    }

    Core.prototype.run = function() {
      return this.loopProcessId = setInterval(this.getFrame, 1000 / this.attributes.fps);
    };

    Core.prototype.stop = function() {
      clearInterval(this.loopProcessId);
      return this.loopProcessId = null;
    };

    Core.prototype.addEntity = function(entity, options) {
      var $view;
      if (options == null) {
        options = {};
      }
      $view = entity.render(options);
      if (entity.willRegister()) {
        ++this.entityCount;
        entity.worldId = "c" + this.entityCount;
        this.entities.push(entity);
        if ($view) {
          return this.$el.append($view);
        }
      }
    };

    Core.prototype.removeEntity = function(entity) {
      this.entities = _.without(this.entities, entity);
      return entity.close();
    };

    Core.prototype.frame = function() {
      var _ref;
      return (_ref = this.f) != null ? _ref : this.f = new RectangularFrame(0, 0, this.$el.width(), this.$el.height());
    };

    Core.prototype.isOutsideViewport = function(frame) {
      var vpFrame;
      vpFrame = this.frame();
      return vpFrame.isExcluding(frame);
    };

    Core.prototype.getFrame = function() {
      var entity, _i, _len, _ref, _results;
      ++this.frameCount;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (entity.isCollidable()) {
          this.checkCollisions(entity);
        }
        _results.push(this.evaluateEntity(entity));
      }
      return _results;
    };

    Core.prototype.evaluateEntity = function(entity) {
      entity.evaluate();
      if (entity.isRemoveable() || this.isOutsideViewport(entity.frame())) {
        return this.removeEntity(entity);
      }
    };

    Core.prototype.checkCollisions = function(entity) {
      var e, _i, _len, _ref, _results;
      _ref = this.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e !== entity && e.isCollidable()) {
          if (entity.frame().isOverlapping(e.frame())) {
            console.log("make damage");
            _results.push(entity.interactWith(e));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    };

    return Core;

  })();

  Entity = (function() {

    Entity.prototype.content = '';

    Entity.prototype.className = 'entity';

    Entity.prototype.tagName = 'div';

    Entity.prototype.events = {};

    Entity.prototype.defaults = {};

    function Entity(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      this.changed = {};
      this.interactions = [];
      this.attributes = attributes;
      this.initialize();
      this;

    }

    Entity.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this;
    };

    Entity.prototype.render = function(options) {
      var callback, event, globalDefaults, _ref;
      if (options == null) {
        options = {};
      }
      globalDefaults = {
        x: 0,
        y: 0,
        width: 48,
        height: 48,
        radius: 0,
        opacity: 1.0,
        collidable: true,
        shape: 'rectangle'
      };
      this._defaults = _.clone(this.defaults);
      this._defaults = _.defaults(this._defaults, globalDefaults);
      this.attributes = _.defaults(options, this._defaults);
      this.el = this.template();
      this.$el = $(this.el);
      this.$el.css(this.styles());
      _ref = this.events;
      for (event in _ref) {
        callback = _ref[event];
        this.$el.on(event, {}, this[callback]);
      }
      return this.$el;
    };

    Entity.prototype.template = function() {
      return "<" + this.tagName + " class='" + this.className + "'>" + this.content + "</" + this.tagName + ">";
    };

    Entity.prototype.set = function(attributes) {
      var changedKeys;
      if (attributes == null) {
        attributes = {};
      }
      changedKeys = _.keys(attributes);
      this.changed = _.pick(this.attributes, changedKeys);
      return _.extend(this.attributes, attributes);
    };

    Entity.prototype.frame = function() {
      if (this.attributes.shape === 'circular') {
        return new CircularFrame(this.attributes.x, this.attributes.y, this.attributes.radius);
      } else {
        return new RectangularFrame(this.attributes.x, this.attributes.y, this.attributes.x + this.attributes.width, this.attributes.y + this.attributes.height);
      }
    };

    Entity.prototype.isCollidable = function() {
      return this.attributes.collidable;
    };

    Entity.prototype.styles = function() {
      return {
        position: 'absolute',
        top: this.attributes.y - (this.attributes.height / 2),
        left: this.attributes.x - (this.attributes.width / 2),
        height: this.attributes.height,
        width: this.attributes.width,
        opacity: this.attributes.opacity
      };
    };

    Entity.prototype.evaluate = function() {
      return this;
    };

    Entity.prototype.willRegister = function() {
      return this;
    };

    Entity.prototype.interactWith = function(entity) {
      var _ref;
      if (_ref = entity.worldId, __indexOf.call(this.interactions, _ref) < 0) {
        this.interactions.push(entity.worldId);
        if (entity.dealsDamage()) {
          return this.takeDamage(entity.damage);
        }
      }
    };

    Entity.prototype.takeDamage = function(damage) {
      return this;
    };

    Entity.prototype.dealsDamage = function() {
      return this.damage != null;
    };

    Entity.prototype.isRemoveable = function() {
      return false;
    };

    Entity.prototype.close = function() {
      return this.$el.remove();
    };

    return Entity;

  })();

  Map = (function() {

    function Map() {}

    return Map;

  })();

  Vertex = (function() {

    function Vertex(x, y) {
      var _ref;
      _ref = [x, y], this.x = _ref[0], this.y = _ref[1];
    }

    Vertex.prototype.vectorWith = function(vertex) {
      var vectorX, vectorY;
      vectorX = this.x - vertex.x;
      vectorY = this.y - vertex.y;
      return new Vector(vectorX, vectorY);
    };

    return Vertex;

  })();

  Vector = (function(_super) {

    __extends(Vector, _super);

    function Vector() {
      return Vector.__super__.constructor.apply(this, arguments);
    }

    Vector.prototype.length = function() {
      return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    Vector.prototype.subtract = function(vector) {
      return new Vector(this.x - vector.x, this.y - vector.y);
    };

    Vector.prototype.divideBy = function(scalar) {
      return (this.x / scalar) + (this.y / scalar);
    };

    Vector.prototype.dotProductOf = function(scalar) {
      return (this.x * scalar) + (this.y * scalar);
    };

    return Vector;

  })(Vertex);

  RectangularFrame = (function() {

    function RectangularFrame(left, top, right, bottom) {
      var _ref;
      _ref = [left, top, right, bottom], this.left = _ref[0], this.top = _ref[1], this.right = _ref[2], this.bottom = _ref[3];
    }

    RectangularFrame.prototype.vertices = function() {
      return [new Vertex(this.left, this.top), new Vertex(this.right, this.top), new Vertex(this.right, this.bottom), new Vertex(this.left, this.bottom)];
    };

    RectangularFrame.prototype.isExcluding = function(excludable) {
      var vertices, _ref, _ref1;
      if (excludable instanceof Vertex) {
        return !((this.left <= (_ref = excludable.x) && _ref <= this.right) && (this.top <= (_ref1 = excludable.y) && _ref1 <= this.bottom));
      } else if (excludable instanceof RectangularFrame) {
        return excludable.right < this.left || excludable.left > this.right || excludable.top > this.bottom || excludable.bottom < this.top;
      } else if (excludable instanceof CircularFrame) {
        vertices = this.vertices();
        return this.isExcluding(excludable.centerVertex()) && excludable.isExcluding(vertices[0]) && excludable.isExcluding(vertices[1]) && excludable.isExcluding(vertices[2]) && excludable.isExcluding(vertices[3]);
      }
    };

    RectangularFrame.prototype.isOverlapping = function(frame) {
      return !this.isExcluding(frame);
    };

    return RectangularFrame;

  })();

  CircularFrame = (function() {

    function CircularFrame(x, y, radius) {
      var _ref;
      _ref = [x, y, radius], this.x = _ref[0], this.y = _ref[1], this.radius = _ref[2];
    }

    CircularFrame.prototype.centerVertex = function() {
      return new Vertex(this.x, this.y);
    };

    CircularFrame.prototype.isExcluding = function(excludable) {
      var distance, dx, dy;
      if (excludable instanceof Vertex) {
        return !this.isOverlapping(excludable);
      } else if (excludable instanceof CircularFrame) {
        dx = this.x - excludable.x;
        dy = this.y - excludable.y;
        distance = Math.sqrt((dy * dy) + (dx * dx));
        return distance > (this.radius + excludable.radius);
      } else if (excludable instanceof RectangularFrame) {
        return !this.isOverlapping(excludable);
      }
    };

    CircularFrame.prototype.isOverlapping = function(excludable) {
      var bottomIntersection, bottomLeftV, bottomRightV, leftIntersection, rightIntersection, squareDistance, topIntersection, topLeftV, topRightV, vertices;
      if (excludable instanceof Vertex) {
        squareDistance = Math.pow(this.x - excludable.x, 2) + Math.pow(this.y - excludable.y, 2);
        return squareDistance < this.radius;
      } else if (excludable instanceof CircularFrame) {
        return this.isExcluding(excludable);
      } else if (excludable instanceof RectangularFrame) {
        vertices = excludable.vertices();
        topLeftV = vertices[0];
        topRightV = vertices[1];
        bottomRightV = vertices[2];
        bottomLeftV = vertices[3];
        topIntersection = this.intersectionWith(topLeftV, topRightV);
        rightIntersection = this.intersectionWith(topRightV, bottomRightV);
        bottomIntersection = this.intersectionWith(bottomRightV, bottomLeftV);
        leftIntersection = this.intersectionWith(bottomLeftV, topLeftV);
        return !excludable.isExcluding(this.centerVertex()) || topIntersection < this.radius || rightIntersection < this.radius || bottomIntersection < this.radius || leftIntersection < this.radius;
      }
    };

    CircularFrame.prototype.intersectionWith = function(v1, v2) {
      var cVector, closest, distanceV, proj, projV, segLength, segVUnit, segVector;
      segVector = v1.vectorWith(v2);
      cVector = this.centerVertex().vectorWith(v2);
      segLength = segVector.length();
      segVUnit = segVector.divideBy(segLength);
      proj = cVector.dotProductOf(segVUnit);
      if (proj <= 0) {
        closest = v1;
      } else if (proj > segLength) {
        closest = v2;
      } else {
        projV = segVUnit * proj;
        closest = new Vector(v1.x + projV, v1.y + projV);
      }
      distanceV = this.centerVertex().vectorWith(closest);
      return distanceV.length();
    };

    return CircularFrame;

  })();

  Bomb = (function(_super) {

    __extends(Bomb, _super);

    function Bomb() {
      return Bomb.__super__.constructor.apply(this, arguments);
    }

    Bomb.prototype.className = 'bomb';

    Bomb.prototype.content = "";

    Bomb.prototype.damage = 45;

    Bomb.prototype.events = {
      'click': 'didClick'
    };

    Bomb.prototype.defaults = {
      shape: 'circular',
      radius: 24
    };

    Bomb.prototype.initialize = function() {
      return this.createdAt = new Date();
    };

    Bomb.prototype.isRemoveable = function() {
      var opacity;
      opacity = this.$el.css('opacity');
      return parseFloat(opacity, 10) === 0;
    };

    Bomb.prototype.explode = function(pixels) {
      if (pixels == null) {
        pixels = 10;
      }
      this.attributes.height += pixels;
      this.attributes.width += pixels;
      return this.attributes.radius += pixels / 2;
    };

    Bomb.prototype.isExploding = function() {
      var date;
      date = new Date();
      return date - this.createdAt > 3000;
    };

    Bomb.prototype.fade = function(dOpacity) {
      var opacity;
      opacity = this.attributes.opacity - dOpacity;
      opacity = Math.round(opacity * 100) / 100;
      if (opacity < 0.0) {
        opacity = 0;
      }
      return this.attributes.opacity = opacity;
    };

    Bomb.prototype.evaluate = function() {
      if (!this.isExploding()) {
        return;
      }
      this.explode(40);
      this.fade(0.4);
      return this.$el.css(this.styles());
    };

    Bomb.prototype.didClick = function(e) {
      return e.stopPropagation();
    };

    return Bomb;

  })(Entity);

  Soldier = (function(_super) {

    __extends(Soldier, _super);

    function Soldier() {
      return Soldier.__super__.constructor.apply(this, arguments);
    }

    Soldier.prototype.className = 'soldier';

    Soldier.prototype.events = {
      'click': 'didClick'
    };

    Soldier.prototype.defaults = {
      width: 12,
      height: 24
    };

    Soldier.prototype.initialize = function() {
      this.health = 100;
      return this.diedAt = null;
    };

    Soldier.prototype.isRemoveable = function() {
      var opacity;
      opacity = this.$el.css('opacity');
      return parseFloat(opacity, 10) === 0;
    };

    Soldier.prototype.takeDamage = function(damage) {
      console.log("" + this.worldId + ": I'm taking damage!");
      this.health -= damage;
      if (this.health <= 0 && !this.isDead()) {
        return this.kill();
      }
    };

    Soldier.prototype.kill = function() {
      this.diedAt = new Date();
      return this.$el.css('background-color', 'black');
    };

    Soldier.prototype.isDead = function() {
      return this.diedAt != null;
    };

    Soldier.prototype.evaluate = function() {
      var opacity, timePassed;
      timePassed = new Date() - this.diedAt;
      if (!(this.isDead() && timePassed > 1000)) {
        return;
      }
      opacity = parseFloat(this.$el.css('opacity'), 10);
      opacity = opacity - 0.05;
      opacity = Math.round(opacity * 100) / 100;
      if (opacity < 0.0) {
        opacity = 0;
      }
      return this.$el.css({
        opacity: opacity
      });
    };

    Soldier.prototype.didClick = function(e) {
      return e.stopPropagation();
    };

    return Soldier;

  })(Entity);

  $(document).ready(function() {
    window.engine = new Core({
      viewport: '#game_canvas',
      fps: 30
    });
    window.engine.run();
    return window.engine.$el.on('click', function(e) {
      var bomb, canvasOffset, solider, x, y;
      canvasOffset = window.engine.$el.offset();
      x = e.pageX - canvasOffset.left;
      y = e.pageY - canvasOffset.top;
      if (e.shiftKey) {
        return solider = window.engine.addEntity(new Soldier(), {
          x: x,
          y: y
        });
      } else {
        return bomb = window.engine.addEntity(new Bomb(), {
          x: x,
          y: y
        });
      }
    });
  });

}).call(this);
