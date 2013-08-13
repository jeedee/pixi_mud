class Kobu.Game
	constructor: ->
		# Create stage
		@stage = new PIXI.Stage(0x000000)
		
		# Create a renderer
		@renderer = PIXI.autoDetectRenderer(900, 700)
		
		# Append the renderer to the body
		document.body.appendChild(@renderer.view)
		
		# Setup the render method
		requestAnimFrame(@render)
		
		# Load assets
		loader = new PIXI.AssetLoader(['tiles/grass.png'])
		loader.onComplete = _.bind(@start, @)
		loader.load()
		
		# Bind document keys
		$(document).on('keydown', @handleKeyboard)
		
		@connect()
	
	handleKeyboard: (e) =>
		switch e.keyCode
			when 37 then @map.container.position.x += 50
			when 38 then @map.container.position.y += 50
			when 39 then @map.container.position.x -= 50
			when 40 then @map.container.position.y -= 50
		
		
	start: ->
		# Setup a Camera
		@camera = new Kobu.Camera(@)
		
		# Load a map
		@map = new Kobu.Map('smallmap.json')
	
	render: =>
		requestAnimFrame(@render)
		@renderer.render(@stage)
	
	connect: ->
		#@socket = io.connect("http://10.0.1.35:8000");