class Kobu.Camera
	constructor: (game) ->
		@game = game
		@renderer = game.renderer
		
		#@spriteFromTexture()
		@map = new Kobu.Map('map.json')
	
	spriteFromTexture: ->
		tileset = new PIXI.Texture.fromImage('grass.png')
		
		texture = new PIXI.Texture(tileset, new PIXI.Rectangle(0,0,32,32))
		@sprite = new PIXI.Sprite(texture)
		@sprite.x = 150
		@sprite.y = 150
		@game.stage.addChild(@sprite)
