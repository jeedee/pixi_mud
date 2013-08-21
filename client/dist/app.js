(function() {
  var __slice = [].slice,
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

  Kobu.networkObjects = (function(_super) {
    __extends(networkObjects, _super);

    function networkObjects() {
      _ref = networkObjects.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    networkObjects.prototype.initialize = function() {
      return this.on('remove', this.entityRemoved);
    };

    networkObjects.prototype.entityRemoved = function(model, collection, options) {
      return Kobu.game.removeChild(model.sprite);
    };

    networkObjects.prototype.findOrCreate = function(character) {
      if (this.get(character.id) != null) {
        return this.get(character.id).set(character);
      } else {
        this.add(new Kobu.Character({
          id: character.id
        }));
        this.get(character.id).set(character);
        Kobu.game.addChild(this.get(character.id).sprite);
        if (Kobu.game.player() === this.get(character.id)) {
          Kobu.game.camera.target = this.get(character.id).sprite;
          return Kobu.game.player().setOwner(true);
        }
      }
    };

    return networkObjects;

  })(Backbone.Collection);

  Kobu.Main = (function() {
    Main.prototype.playerId = null;

    Main.prototype.player = function() {
      return this.networkObjects.get(this.playerId);
    };

    function Main() {
      this.render = __bind(this.render, this);
      this.handleKeyboard = __bind(this.handleKeyboard, this);
      Kobu.game = this;
      this.stage = new PIXI.Stage(0x000000);
      this.renderer = PIXI.autoDetectRenderer(900, 700);
      this.world = new PIXI.DisplayObjectContainer;
      this.stage.addChild(this.world);
      this.objectLayer = new PIXI.DisplayObjectContainer;
      $('body #canvas').append(this.renderer.view);
      $('body').append("<input type=\"text\" id=\"chat\" /> ");
      $('#chat').css('width', '900px');
      this.loader = new PIXI.AssetLoader(['tiles/atlas1.png', 'tiles/atlas2.png', 'tiles/atlas3.png', 'tiles/atlas4.png', 'sprites/01.json', 'sprites/01_attack.json']);
      this.loader.onComplete = _.bind(this.start, this);
      this.loader.load();
      this.networkObjects = new Kobu.networkObjects;
      $(document).on('keydown', this.handleKeyboard);
    }

    Main.prototype.handleKeyboard = function(e) {
      var orientation;
      if (Kobu.game.player() == null) {
        return;
      }
      orientation = '';
      if (e.keyCode === 13) {
        this.player().toggleChat();
      }
      console.log("Pressed " + e.keyCode);
      if (!this.player().isTyping) {
        switch (e.keyCode) {
          case 32:
            this.player().attack();
            return false;
          case 37:
            orientation = Kobu.ORIENTATION.LEFT;
            break;
          case 38:
            orientation = Kobu.ORIENTATION.UP;
            break;
          case 39:
            orientation = Kobu.ORIENTATION.RIGHT;
            break;
          case 40:
            orientation = Kobu.ORIENTATION.DOWN;
        }
      }
      if (orientation !== '') {
        this.player().set({
          orientation: orientation
        }, {
          silent: true
        });
        this.player().trigger('change:orientation', this.player(), orientation, {
          localTrigger: true
        });
        return false;
      }
    };

    Main.prototype.start = function() {
      this.camera = new Kobu.Camera(this);
      this.map = new Kobu.Map('maps/default.json');
      this.network = new Kobu.Network;
      return window.requestAnimFrame(_.bind(this.render, this));
    };

    Main.prototype.render = function() {
      window.requestAnimFrame(_.bind(this.render, this));
      this.camera.update();
      return this.renderer.render(this.stage);
    };

    Main.prototype.addChild = function(child) {
      return this.objectLayer.addChild(child);
    };

    Main.prototype.removeChild = function(child) {
      return this.objectLayer.removeChild(child);
    };

    return Main;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kobu.MapTile = (function(_super) {
    var tileProperties;

    __extends(MapTile, _super);

    tileProperties = {};

    function MapTile() {
      MapTile.__super__.constructor.apply(this, arguments);
    }

    return MapTile;

  })(PIXI.Texture);

  Kobu.Map = (function() {
    function Map(filename) {
      this.makeSprite = __bind(this.makeSprite, this);
      this.parseMap = __bind(this.parseMap, this);
      this.tiles = new Array;
      this.container = new PIXI.DisplayObjectContainer;
      Kobu.game.world.addChild(this.container);
      $.getJSON("" + filename, this.parseMap);
    }

    Map.prototype.tileProperty = function(x, y, property) {
      var _ref, _ref1;
      if (((_ref = this.tilesProperties[x]) != null ? (_ref1 = _ref[y + 1]) != null ? _ref1[property] : void 0 : void 0) != null) {
        return this.tilesProperties[x][y + 1][property];
      } else {
        return null;
      }
    };

    Map.prototype.parseMap = function(map) {
      var i, idx, index, layer, tileset, timerStart, totalTiles, x, y, z, _i, _j, _k, _l, _len, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
      timerStart = Date.now();
      this.width = map.width;
      this.height = map.height;
      this.tilesProperties = (function() {
        _results = [];
        for (var _i = 0, _ref = this.width; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(x) {
        var _i, _ref, _results;
        return (function() {
          _results = [];
          for (var _i = 0, _ref = this.height; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function(y) {});
      });
      _ref1 = map.tilesets;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        tileset = _ref1[_j];
        index = tileset.firstgid;
        totalTiles = (tileset.imageheight / tileset.tileheight) * (tileset.imagewidth / tileset.tilewidth);
        for (i = _k = 0, _ref2 = totalTiles - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
          this.tiles[index] = this.getTile(i, tileset);
          index += 1;
        }
      }
      for (z = _l = 0, _ref3 = map.layers.length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; z = 0 <= _ref3 ? ++_l : --_l) {
        layer = new PIXI.DisplayObjectContainer;
        i = 0;
        if (z === 2) {
          this.container.addChild(Kobu.game.objectLayer);
        }
        for (y = _m = 0, _ref4 = map.height - 1; 0 <= _ref4 ? _m <= _ref4 : _m >= _ref4; y = 0 <= _ref4 ? ++_m : --_m) {
          for (x = _n = 0, _ref5 = map.width - 1; 0 <= _ref5 ? _n <= _ref5 : _n >= _ref5; x = 0 <= _ref5 ? ++_n : --_n) {
            idx = map.layers[z].data[i];
            if (map.layers[z].name === 'Meta' || map.layers[z].name === 'meta') {
              if (((_ref6 = this.tiles[idx]) != null ? _ref6.tileProperties : void 0) != null) {
                this.tilesProperties[x][y] = this.tiles[idx].tileProperties;
              }
            } else {
              if (map.layers[z].data[i] !== 0) {
                layer.addChild(this.makeSprite(idx, x, y));
              }
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

    Map.prototype.getTile = function(index, tileset) {
      var horizontalTiles, tile, tileX, tileY, tilesetImage, _ref;
      horizontalTiles = tileset.imagewidth / tileset.tilewidth;
      tileX = ~~(index % horizontalTiles);
      tileY = ~~(index / horizontalTiles);
      tilesetImage = new PIXI.Texture.fromImage("tiles/" + tileset.name + ".png");
      tile = new Kobu.MapTile(tilesetImage, new PIXI.Rectangle(tileX * 32, tileY * 32, 32, 32));
      if (((_ref = tileset.tileproperties) != null ? _ref[index] : void 0) != null) {
        tile.tileProperties = tileset.tileproperties[index];
      }
      return tile;
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
      this.socket.on('action', _.bind(this.actionRequest, this));
    }

    Network.prototype.setRequest = function(id, data) {
      return this.socket.emit('set', data);
    };

    Network.prototype.selfRequest = function(data) {
      return Kobu.game.playerId = data.id;
    };

    Network.prototype.getRequest = function(data) {
      if (data.id != null) {
        return Kobu.game.networkObjects.findOrCreate(data);
      }
    };

    Network.prototype.sendAction = function(id, data) {
      var request;
      request = {
        id: id,
        data: data
      };
      return this.socket.emit('action', request);
    };

    Network.prototype.actionRequest = function(request) {
      var action, data, fn;
      action = request.id.charAt(0).toUpperCase() + request.id.slice(1);
      if (request.data != null) {
        data = request.data;
      }
      fn = this["action" + action];
      if (typeof fn === 'function') {
        return fn(data);
      } else {
        return console.log("Server sent an unsupported RPC! " + action);
      }
    };

    Network.prototype.actionAttack = function(data) {
      return Kobu.game.networkObjects.get(data.id).attack(false);
    };

    Network.prototype.actionChat = function(data) {
      return Kobu.game.networkObjects.get(data.id).sayText(data.text);
    };

    Network.prototype.actionRemove = function(data) {
      return Kobu.game.networkObjects.remove(data.id);
    };

    return Network;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kobu.ORIENTATION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
  };

  Kobu.Sprite = (function(_super) {
    __extends(Sprite, _super);

    Sprite.prototype.isPlaying = false;

    Sprite.prototype.animationName = 'down';

    Sprite.prototype.currentFrame = 1;

    Sprite.prototype.animationSpeed = 0.35;

    Sprite.prototype.playOnce = true;

    Sprite.prototype.orientation = Kobu.ORIENTATION.DOWN;

    function Sprite(textureId) {
      this.orientationChanged = __bind(this.orientationChanged, this);
      var texture;
      this.id = textureId;
      texture = PIXI.TextureCache["" + textureId + "_down1.png"];
      _.extend(this, Backbone.Events);
      Sprite.__super__.constructor.call(this, texture);
    }

    Sprite.prototype.setupEvents = function() {
      if (typeof parent === "undefined" || parent === null) {
        return;
      }
      this.parent.on('change:orientation', _.bind(this.orientationChanged, this));
      return this.parent.on('playAnimation', _.bind(this.playAnimation, this));
    };

    Sprite.prototype.orientationChanged = function(orientation) {
      this.orientation = orientation;
      return this.setTexture(PIXI.TextureCache["" + this.id + "_" + this.orientation + "1.png"]);
    };

    Sprite.prototype.playAnimation = function(name, once) {
      if (once == null) {
        once = true;
      }
      this.animationName = name;
      this.isPlaying = true;
      return this.playOnce = once;
    };

    Sprite.prototype.stopAnimation = function(frame) {
      if (frame == null) {
        frame = null;
      }
      this.isPlaying = false;
      if (frame != null) {
        return this.setTexture(PIXI.TextureCache["" + this.id + "_" + frame + "1.png"]);
      } else {
        return this.setTexture(PIXI.TextureCache["" + this.id + "_" + this.orientation + "1.png"]);
      }
    };

    Sprite.prototype.updateTransform = function() {
      var round;
      Sprite.__super__.updateTransform.apply(this, arguments);
      if (this.isPlaying) {
        this.currentFrame += this.animationSpeed;
        round = Math.round(this.currentFrame);
        if (_.has(PIXI.TextureCache, "" + this.id + "_" + this.orientation + this.animationName + (round + 1) + ".png")) {
          return this.setTexture(PIXI.TextureCache["" + this.id + "_" + this.orientation + this.animationName + round + ".png"]);
        } else {
          this.currentFrame = 1;
          if (this.playOnce) {
            return this.stopAnimation();
          }
        }
      }
    };

    Sprite.getOrientationIncrement = function(orientation) {
      switch (orientation) {
        case Kobu.ORIENTATION.UP:
          return {
            x: 0,
            y: -1
          };
        case Kobu.ORIENTATION.LEFT:
          return {
            x: -1,
            y: 0
          };
        case Kobu.ORIENTATION.RIGHT:
          return {
            x: 1,
            y: 0
          };
        case Kobu.ORIENTATION.DOWN:
          return {
            x: 0,
            y: 1
          };
      }
    };

    Sprite.getOrientation = function(x, y) {
      if (x > 0) {
        return Kobu.ORIENTATION.UP;
      }
      if (x < 0) {
        return Kobu.ORIENTATION.DOWN;
      }
      if (y > 0) {
        return Kobu.ORIENTATION.LEFT;
      }
      if (y < 0) {
        return Kobu.ORIENTATION.RIGHT;
      }
    };

    return Sprite;

  })(PIXI.Sprite);

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Kobu.Character = (function(_super) {
    var bubbleTimeout, isTyping;

    __extends(Character, _super);

    function Character() {
      this.sayText = __bind(this.sayText, this);
      this.spriteIdChanged = __bind(this.spriteIdChanged, this);
      _ref = Character.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Character.prototype.isOwner = false;

    Character.prototype._moving = false;

    bubbleTimeout = null;

    isTyping = false;

    Character.prototype.initialize = function(opts) {
      this.sprite = new PIXI.DisplayObjectContainer;
      this.chatBubble = new PIXI.DisplayObjectContainer;
      this.sprite.addChild(this.chatBubble);
      _.extend(this.sprite, Backbone.Events);
      this.on('change:spriteId', this.spriteIdChanged);
      this.on('change:typing', this.typing);
      this.on('change:position', this.positionChanged);
      this.on('change:orientation', this.orientationChanged);
      return this.on('change:hp', this.hpChanged);
    };

    Character.prototype.spriteIdChanged = function(model, spriteId, options) {
      this._sprite = new Kobu.Sprite(spriteId);
      this.sprite.addChild(this._sprite);
      return this._sprite.setupEvents();
    };

    Character.prototype.attack = function(local) {
      if (local == null) {
        local = true;
      }
      this.sprite.trigger('playAnimation', 'attack');
      if (local) {
        return Kobu.game.network.sendAction('attack', {});
      }
    };

    Character.prototype.toggleChat = function() {
      var text;
      if (this.isTyping) {
        this.isTyping = false;
      } else {
        this.isTyping = true;
      }
      if (this.isTyping) {
        return $('#chat').focus();
      } else {
        text = $('#chat').val();
        console.log(text);
        Kobu.game.network.sendAction('chat', {
          text: text
        });
        $('#chat').val('');
        return $('#chat').blur();
      }
    };

    Character.prototype.sayText = function(content) {
      var rectangle, text;
      if (this.bubbleTimeout != null) {
        window.clearTimeout(this.bubbleTimeout);
      }
      if (this.bubbleTween != null) {
        this.bubbleTween.kill();
      }
      if (this.chatBubble.children.length > 0) {
        console.log(this.chatBubble.children);
        this.chatBubble.removeChild(this.chatBubble.getChildAt(0));
        this.chatBubble.removeChild(this.chatBubble.getChildAt(0));
      }
      text = new PIXI.Text(content, {
        font: "11px Arial",
        fill: "white",
        wordWrap: true,
        wordWrapWidth: 110,
        stroke: 'black',
        strokeThickness: 1
      });
      text.position.x = -35;
      text.position.y = -70;
      rectangle = new PIXI.Graphics;
      rectangle.alpha = 0.5;
      rectangle.beginFill(0x000000);
      rectangle.drawRect(0, 0, 120, text.height);
      rectangle.moveTo(45, text.height);
      rectangle.lineTo(60, text.height + 10);
      rectangle.lineTo(75, text.height);
      rectangle.position.x = -45;
      rectangle.position.y = -70;
      this.chatBubble.alpha = 1;
      this.chatBubble.addChild(rectangle);
      this.chatBubble.addChild(text);
      return this.bubbleTimeout = window.setTimeout(_.bind(this.clearBubble, this), 3000);
    };

    Character.prototype.clearBubble = function() {
      return this.bubbleTween = TweenLite.to(this.chatBubble, 1, {
        alpha: 0,
        ease: 'Linear.easeNone'
      });
    };

    Character.prototype.manageObjectDepth = function() {
      var entity, increment, objectsAbove, upPosition, _i, _len, _results;
      return;
      increment = Kobu.Sprite.getOrientationIncrement(Kobu.ORIENTATION.UP);
      upPosition = {
        x: this.get('position').x + increment.x,
        y: this.get('position').y + increment.y
      };
      objectsAbove = _.filter(Kobu.game.networkObjects.models, function(model) {
        return model.get('position').x === upPosition.x && model.get('position').y === upPosition.y;
      });
      _results = [];
      for (_i = 0, _len = objectsAbove.length; _i < _len; _i++) {
        entity = objectsAbove[_i];
        if (Kobu.game.objectLayer.children.indexOf(entity.sprite) > Kobu.game.objectLayer.children.indexOf(this.sprite)) {
          console.log(Kobu.game.objectLayer.children.indexOf(entity.sprite));
          console.log(Kobu.game.objectLayer.children.indexOf(this.sprite));
          Kobu.game.objectLayer.swapChildren(entity.sprite, this.sprite);
          _results.push(console.log('swapped'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Character.prototype.orientationChanged = function(model, orientation, options) {
      var increment, newPosition;
      if (this.previous('orientation') !== orientation) {
        this.sprite.trigger('change:orientation', orientation);
        if (options.localTrigger != null) {
          Kobu.game.network.setRequest(0, {
            orientation: orientation
          });
        }
      }
      if (this.isOwner && this.previous('orientation') === orientation && !this._moving) {
        increment = Kobu.Sprite.getOrientationIncrement(orientation);
        newPosition = {
          x: this.get('position').x + increment.x,
          y: this.get('position').y + increment.y
        };
        if (!Kobu.game.map.tileProperty(newPosition.x, newPosition.y, 'WALKABLE')) {
          return this.set({
            position: newPosition
          }, {
            localTrigger: true
          });
        }
      }
    };

    Character.prototype.positionChanged = function(model, value, options) {
      var _this = this;
      if (options.localTrigger != null) {
        Kobu.game.network.setRequest(0, {
          position: value
        });
      }
      this.manageObjectDepth();
      if (this.previous('position')) {
        return TweenLite.to(this.sprite.position, 0.4, {
          x: value.x * 32,
          y: value.y * 32,
          ease: 'Linear.easeNone',
          onStart: function() {
            _this.sprite.trigger('playAnimation', '');
            return _this._moving = true;
          },
          onComplete: function() {
            return _this._moving = false;
          }
        });
      } else {
        return this.sprite.position = {
          x: value.x * 32,
          y: value.y * 32
        };
      }
    };

    Character.prototype.showHpBar = function(percent) {
      if (this.hpTimeout != null) {
        window.clearTimeout(this.hpTimeout);
      }
      if (this.hpTween != null) {
        this.hpTween.kill();
      }
      if (this.healthBar != null) {
        this.sprite.removeChild(this.healthBar);
      }
      this.healthBar = new PIXI.Graphics;
      this.healthBar.beginFill(0xff0000);
      this.healthBar.drawRect(0, -10, percent / 3, 5);
      this.sprite.addChild(this.healthBar);
      return this.hpTimeout = window.setTimeout(_.bind(this.clearHpBar, this), 3000);
    };

    Character.prototype.clearHpBar = function() {
      return this.hpTween = TweenLite.to(this.healthBar, 1, {
        alpha: 0,
        ease: 'Linear.easeNone'
      });
    };

    Character.prototype.hpChanged = function(model, value, options) {
      var healthPercent;
      healthPercent = this.get('hp') * 100 / this.get('totalHp');
      if (this.isOwner) {
        $('div#health').text("" + (this.get('hp')));
        $('div#health').css("width", "" + healthPercent + "px");
      }
      if (healthPercent < 100) {
        return this.showHpBar(healthPercent);
      }
    };

    Character.prototype.setOwner = function(tf) {
      this.isOwner = tf;
      return this.trigger('change:hp');
    };

    return Character;

  })(Backbone.Model);

}).call(this);
