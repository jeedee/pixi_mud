class Kobu.CharacterGroup extends Backbone.Collection
	initialize: ->
	
	findOrCreate: (character) ->
		if @get(character.id)?
			@get(character.id).set(character)
		else
			@add(new Kobu.Character(character))
			Kobu.game.addChild(@get(character.id).sprite)
			
			Kobu.game.camera.target = @get(character.id).sprite if Kobu.game.player() == @get(character.id)
		

class Kobu.Main
	playerId: null
	
	player: ->
		return @characterGroup.get(@playerId)
	
	constructor: ->
		Kobu.game = @
		
		# Create stage
		@stage = new PIXI.Stage(0x000000)
		
		# Create a renderer
		@renderer = PIXI.autoDetectRenderer(900, 700)
		
		# Create the world & Add it to the stage
		@world = new PIXI.DisplayObjectContainer
		@stage.addChild(@world)
		
		# Append the renderer to the body
		document.body.appendChild(@renderer.view)
		
		# Load assets
		@loader = new PIXI.AssetLoader(['tiles/grass.png', 'sprites/01.json'])
		@loader.onComplete = _.bind(@start, @)
		@loader.load()
		
		# Setup groups
		@characterGroup = new Kobu.CharacterGroup
		
		# Bind document keys
		$(document).on('keydown', @handleKeyboard)
	
	handleKeyboard: (e) =>
		newPosition = _.clone(@player().get('position'))
		
		switch e.keyCode
			when 37
				newPosition.x += -32
				anim = 'left'
			when 38
				newPosition.y += -32
				anim = 'up'
			when 39
				newPosition.x += 32
				anim = 'right'
			when 40
				newPosition.y += 32
				anim = 'down'
		console.log newPosition
		@player().set({position: newPosition})
		Kobu.game.network.setRequest(0, {position: newPosition})
		
	start: ->
		# Setup a Camera
		@camera = new Kobu.Camera(@)
		
		# Load a map
		@map = new Kobu.Map('largemap.json')
		
		# Setup network manager
		@network = new Kobu.Network
		
		# Setup the render method
		window.requestAnimFrame(_.bind(@render,@))
	
	render: =>
		# Prepare next anim frame
		window.requestAnimFrame(_.bind(@render, @))
		# Update camera
		@camera.update()
		
		# Render stage
		@renderer.render(@stage)
	
	## CONTAINER METHODS
	addChild: (child) ->
		@world.addChild(child)
		
	removeChild: (child) ->
		@world.removeChild(child)