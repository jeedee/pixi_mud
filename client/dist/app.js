(function() {
  var move,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Kobu = {};

  window.mixOf = function() {
    var Mixed, base, method, mixin, mixins, name, _i, _ref, _ref1;
    base = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    Mixed = (function(_super) {
      __extends(Mixed, _super);

      function Mixed() {
        _ref = Mixed.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return Mixed;

    })(base);
    for (_i = mixins.length - 1; _i >= 0; _i += -1) {
      mixin = mixins[_i];
      _ref1 = mixin.prototype;
      for (name in _ref1) {
        method = _ref1[name];
        Mixed.prototype[name] = method;
      }
    }
    return Mixed;
  };

  move = function(dir) {
    var position, target;
    target = $("div#" + window.selfId);
    position = {
      x: target.position().left,
      y: target.position().top
    };
    switch (dir) {
      case 'up':
        return position.y -= 1;
      case 'down':
        return position.y += 1;
      case 'left':
        return position.x -= 1;
      case 'right':
        return position.x += 1;
    }
  };

  $(document).ready(function() {
    return Kobu.game = new Kobu.Main;
  });

}).call(this);

(function() {
  Kobu.Camera = (function() {
    function Camera(game) {
      this.position = new PIXI.Point;
      this.target = null;
    }

    Camera.prototype.pan = function(x, y) {
      this.position.x += x;
      return this.position.y -= y;
    };

    Camera.prototype.update = function() {
      if ((this.target != null)) {
        this.position.x = Math.round(-this.target.position.x + (900 / 2));
        this.position.y = Math.round(-this.target.position.y + (700 / 2));
      }
      Kobu.game.world.position.x = this.position.x;
      return Kobu.game.world.position.y = this.position.y;
    };

    return Camera;

  })();

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kobu.CharacterGroup = (function(_super) {
    __extends(CharacterGroup, _super);

    function CharacterGroup() {
      _ref = CharacterGroup.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CharacterGroup.prototype.initialize = function() {};

    CharacterGroup.prototype.findOrCreate = function(character) {
      if (this.get(character.id) != null) {
        return this.get(character.id).set(character);
      } else {
        this.add(new Kobu.Character(character));
        Kobu.game.addChild(this.get(character.id).sprite);
        if (Kobu.game.player() === this.get(character.id)) {
          return Kobu.game.camera.target = this.get(character.id).sprite;
        }
      }
    };

    return CharacterGroup;

  })(Backbone.Collection);

  Kobu.Main = (function() {
    Main.prototype.playerId = null;

    Main.prototype.player = function() {
      return this.characterGroup.get(this.playerId);
    };

    function Main() {
      this.render = __bind(this.render, this);
      this.handleKeyboard = __bind(this.handleKeyboard, this);
      Kobu.game = this;
      this.stage = new PIXI.Stage(0x000000);
      this.renderer = PIXI.autoDetectRenderer(900, 700);
      this.world = new PIXI.DisplayObjectContainer;
      this.stage.addChild(this.world);
      document.body.appendChild(this.renderer.view);
      this.loader = new PIXI.AssetLoader(['tiles/grass.png', 'sprites/01.json']);
      this.loader.onComplete = _.bind(this.start, this);
      this.loader.load();
      this.characterGroup = new Kobu.CharacterGroup;
      $(document).on('keydown', this.handleKeyboard);
    }

    Main.prototype.handleKeyboard = function(e) {
      var anim, newPosition;
      newPosition = _.clone(this.player().get('position'));
      switch (e.keyCode) {
        case 37:
          newPosition.x += -32;
          anim = 'left';
          break;
        case 38:
          newPosition.y += -32;
          anim = 'up';
          break;
        case 39:
          newPosition.x += 32;
          anim = 'right';
          break;
        case 40:
          newPosition.y += 32;
          anim = 'down';
      }
      console.log(newPosition);
      this.player().set({
        position: newPosition
      });
      return Kobu.game.network.setRequest(0, {
        position: newPosition
      });
    };

    Main.prototype.start = function() {
      this.camera = new Kobu.Camera(this);
      this.map = new Kobu.Map('largemap.json');
      this.network = new Kobu.Network;
      return window.requestAnimFrame(_.bind(this.render, this));
    };

    Main.prototype.render = function() {
      window.requestAnimFrame(_.bind(this.render, this));
      this.camera.update();
      return this.renderer.render(this.stage);
    };

    Main.prototype.addChild = function(child) {
      return this.world.addChild(child);
    };

    Main.prototype.removeChild = function(child) {
      return this.world.removeChild(child);
    };

    return Main;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kobu.Map = (function() {
    function Map(filename) {
      this.makeSprite = __bind(this.makeSprite, this);
      this.parseMap = __bind(this.parseMap, this);
      this.tiles = new Array;
      this.container = new PIXI.DisplayObjectContainer;
      Kobu.game.addChild(this.container);
      $.getJSON("" + filename, this.parseMap);
    }

    Map.prototype.parseMap = function(map) {
      var horizontalTiles, i, index, layer, tileset, timerStart, totalTiles, x, y, z, _i, _j, _k, _l, _len, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      timerStart = Date.now();
      this.width = map.width;
      this.height = map.height;
      _ref = map.tilesets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tileset = _ref[_i];
        index = tileset.firstgid;
        totalTiles = (tileset.imageheight / tileset.tileheight) * (tileset.imagewidth / tileset.tilewidth);
        horizontalTiles = tileset.imagewidth / tileset.tilewidth;
        for (i = _j = 0, _ref1 = totalTiles - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          this.tiles[index] = this.getTile(i, tileset.name, horizontalTiles);
          index += 1;
        }
      }
      for (z = _k = 0, _ref2 = map.layers.length - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; z = 0 <= _ref2 ? ++_k : --_k) {
        layer = new PIXI.DisplayObjectContainer;
        i = 0;
        for (y = _l = 0, _ref3 = map.height - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; y = 0 <= _ref3 ? ++_l : --_l) {
          for (x = _m = 0, _ref4 = map.width - 1; 0 <= _ref4 ? _m <= _ref4 : _m >= _ref4; x = 0 <= _ref4 ? ++_m : --_m) {
            if (map.layers[z].data[i] !== 0) {
              layer.addChild(this.makeSprite(map.layers[z].data[i], x, y));
            }
            i += 1;
          }
        }
        this.container.addChild(layer);
        i = 0;
      }
      return $('body').append("Loaded in " + (Date.now() - timerStart) + "ms");
    };

    Map.prototype.makeSprite = function(index, x, y) {
      var sprite;
      sprite = new PIXI.Sprite(this.tiles[index]);
      sprite.position.x = x * 32;
      sprite.position.y = y * 32;
      return sprite;
    };

    Map.prototype.getTile = function(index, tileset, horizontalTiles) {
      var texture, tileX, tileY;
      tileX = ~~(index % horizontalTiles);
      tileY = ~~(index / horizontalTiles);
      tileset = new PIXI.Texture.fromImage("tiles/" + tileset + ".png");
      texture = new PIXI.Texture(tileset, new PIXI.Rectangle(tileX * 32, tileY * 32, 32, 32));
      return texture;
    };

    return Map;

  })();

}).call(this);

(function() {
  Kobu.Network = (function() {
    function Network() {
      this.socket = io.connect("http://72.11.167.69:8000");
      this.socket.on('self', _.bind(this.selfRequest, this));
      this.socket.on('get', _.bind(this.getRequest, this));
    }

    Network.prototype.setRequest = function(id, data) {
      return this.socket.emit('set', data);
    };

    Network.prototype.selfRequest = function(data) {
      return Kobu.game.playerId = data.id;
    };

    Network.prototype.getRequest = function(data) {
      if (data.id != null) {
        return Kobu.game.characterGroup.findOrCreate(data);
      }
    };

    return Network;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kobu.Sprite = (function(_super) {
    __extends(Sprite, _super);

    Sprite.prototype.isPlaying = false;

    Sprite.prototype.animationName = 'down';

    Sprite.prototype.currentFrame = 1;

    Sprite.prototype.animationSpeed = 0.35;

    Sprite.prototype.playOnce = true;

    function Sprite(textureId) {
      var texture;
      this.id = textureId;
      texture = PIXI.TextureCache["" + textureId + "_down1.png"];
      Sprite.__super__.constructor.call(this, texture);
    }

    Sprite.prototype.playAnimation = function(name, once) {
      if (once == null) {
        once = true;
      }
      this.animationName = name;
      this.isPlaying = true;
      return this.playOnce = once;
    };

    Sprite.prototype.setOrientation = function(id) {
      return this.setTexture(PIXI.TextureCache["" + this.id + "_" + Kobu.Sprite.orientation[id] + "1.png"]);
    };

    Sprite.prototype.stopAnimation = function(frame) {
      if (frame == null) {
        frame = null;
      }
      this.isPlaying = false;
      if (frame != null) {
        return this.setTexture(PIXI.TextureCache["" + this.id + "_" + frame + "1.png"]);
      } else {
        return this.setTexture(PIXI.TextureCache["" + this.id + "_" + this.animationName + "1.png"]);
      }
    };

    Sprite.prototype.updateTransform = function() {
      var round;
      Sprite.__super__.updateTransform.apply(this, arguments);
      if (this.isPlaying) {
        this.currentFrame += this.animationSpeed;
        round = Math.round(this.currentFrame);
        if (_.has(PIXI.TextureCache, "" + this.id + "_" + this.animationName + (round + 1) + ".png")) {
          return this.setTexture(PIXI.TextureCache["" + this.id + "_" + this.animationName + round + ".png"]);
        } else {
          this.currentFrame = 1;
          if (this.playOnce) {
            return this.stopAnimation();
          }
        }
      }
    };

    Sprite.prototype.getOrientation = function(x, y) {
      if (x > 0) {
        return 3;
      }
      if (x < 0) {
        return 2;
      }
      if (y > 0) {
        return 1;
      }
      if (y < 0) {
        return 0;
      }
    };

    return Sprite;

  })(PIXI.Sprite);

  Kobu.Sprite.orientation = {
    0: 'up',
    1: 'down',
    2: 'left',
    3: 'right'
  };

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kobu.Character = (function(_super) {
    __extends(Character, _super);

    function Character() {
      _ref = Character.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Character.prototype.initialize = function(opts) {
      this.sprite = new PIXI.DisplayObjectContainer;
      this._sprite = new Kobu.Sprite(opts.spriteId);
      this.sprite.addChild(this._sprite);
      this.sprite.position = opts.position;
      this._sprite.setOrientation(opts.orientation);
      return this.on('change:position', this.positionChanged);
    };

    Character.prototype.positionChanged = function(model, value, options) {
      var orientation,
        _this = this;
      console.log("Previous is " + (value.x - this.previous("position").x));
      orientation = this._sprite.getOrientation(value.x - this.previous("position").x, value.y - this.previous("position").y);
      return TweenLite.to(this.sprite.position, 0.4, {
        x: value.x,
        y: value.y,
        ease: 'Linear.easeNone',
        onStart: function() {
          return _this._sprite.playAnimation(Kobu.Sprite.orientation[orientation]);
        }
      });
    };

    return Character;

  })(Backbone.Model);

}).call(this);
