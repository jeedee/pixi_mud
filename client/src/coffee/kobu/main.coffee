class Kobu.Game
	constructor: ->
		# Create stage
		@stage = new PIXI.Stage(0x000000)
		
		# Create a renderer
		@renderer = PIXI.autoDetectRenderer(640, 480)
		
		# Append the renderer to the body
		document.body.appendChild(@renderer.view)
		
		# Setup the render method
		requestAnimFrame(@render)
		
		# Load assets
		loader = new PIXI.AssetLoader(['grass.png'])
		loader.onComplete = _.bind(@start, @)
		loader.load()

		@connect()
	
	start: ->
		# Setup a Camera
		@camera = new Kobu.Camera(@)
	
	render: =>
		requestAnimFrame(@render)
		@renderer.render(@stage)
	
	connect: ->
		@socket = io.connect("http://10.0.1.35:8000");