(function() {
  var move;

  window.Kobu = {};

  move = function(dir) {
    var position, target;
    target = $("div#" + window.selfId);
    position = {
      x: target.position().left,
      y: target.position().top
    };
    switch (dir) {
      case 'up':
        position.y -= 1;
        break;
      case 'down':
        position.y += 1;
        break;
      case 'left':
        position.x -= 1;
        break;
      case 'right':
        position.x += 1;
    }
    return window.socket.emit('set', {
      position: position
    });
  };

  $(document).ready(function() {
    return Kobu.game = new Kobu.Game;
  });

}).call(this);

(function() {
  Kobu.Camera = (function() {
    function Camera(game) {
      this.game = game;
      this.renderer = game.renderer;
      this.map = new Kobu.Map('map.json');
    }

    Camera.prototype.spriteFromTexture = function() {
      var texture, tileset;
      tileset = new PIXI.Texture.fromImage('grass.png');
      texture = new PIXI.Texture(tileset, new PIXI.Rectangle(0, 0, 32, 32));
      this.sprite = new PIXI.Sprite(texture);
      this.sprite.x = 150;
      this.sprite.y = 150;
      return this.game.stage.addChild(this.sprite);
    };

    return Camera;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Kobu.Game = (function() {
    function Game() {
      this.render = __bind(this.render, this);
      var loader;
      this.stage = new PIXI.Stage(0x000000);
      this.renderer = PIXI.autoDetectRenderer(640, 480);
      document.body.appendChild(this.renderer.view);
      requestAnimFrame(this.render);
      loader = new PIXI.AssetLoader(['grass.png']);
      loader.onComplete = _.bind(this.start, this);
      loader.load();
      this.connect();
    }

    Game.prototype.start = function() {
      return this.camera = new Kobu.Camera(this);
    };

    Game.prototype.render = function() {
      requestAnimFrame(this.render);
      return this.renderer.render(this.stage);
    };

    Game.prototype.connect = function() {
      return this.socket = io.connect("http://10.0.1.35:8000");
    };

    return Game;

  })();

}).call(this);

(function() {
  Kobu.Map = (function() {
    function Map(filename) {
      console.log("loading " + filename);
    }

    return Map;

  })();

}).call(this);
