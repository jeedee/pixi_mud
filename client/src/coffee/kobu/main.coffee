class Kobu.networkObjects extends Backbone.Collection
	initialize: ->
		@on('remove', @entityRemoved)
	
	entityRemoved: (model, collection, options) ->
		Kobu.game.removeChild(model.sprite)
	
	findOrCreate: (character) ->
		if @get(character.id)?
			@get(character.id).set(character)
		else
			@add(new Kobu.Character({id: character.id}))
			@get(character.id).set(character)
			Kobu.game.addChild(@get(character.id).sprite)
			
			if Kobu.game.player() == @get(character.id)
				Kobu.game.camera.target = @get(character.id).sprite 
				Kobu.game.player().setOwner(true)
	
		

class Kobu.Main
	playerId: null
	
	player: ->
		return @networkObjects.get(@playerId)
	
	constructor: ->
		Kobu.game = @
		
		# Create stage
		@stage = new PIXI.Stage(0x000000)
		
		# Create a renderer
		@renderer = PIXI.autoDetectRenderer(900, 700)
		
		# Create the world & Add it to the stage
		@world = new PIXI.DisplayObjectContainer
		@stage.addChild(@world)
		
		# Create an object layer
		@objectLayer = new PIXI.DisplayObjectContainer
		
		# Append the renderer to the body
		$('body').append(@renderer.view)
		$('body').append("""<input type="text" id="chat" /> """)
		$('#chat').css('width', '900px')
		
		
		# Load assets
		@loader = new PIXI.AssetLoader(['tiles/atlas1.png','tiles/atlas2.png','tiles/atlas3.png','tiles/atlas4.png', 'sprites/01.json', 'sprites/01_attack.json'])
		@loader.onComplete = _.bind(@start, @)
		@loader.load()
		
		# Setup groups
		@networkObjects = new Kobu.networkObjects
		
		# Bind document keys
		$(document).on('keydown', @handleKeyboard)
	
	handleKeyboard: (e) =>
		return unless Kobu.game.player()?
		orientation = ''
		
		if e.keyCode == 13
			@player().toggleChat() 
		
		console.log "Pressed #{e.keyCode}"
		if not @player().isTyping
			switch e.keyCode
				# ORIENTATION
				when 32
					@player().attack()
					return false
				when 37 then orientation = Kobu.ORIENTATION.LEFT
				when 38 then orientation = Kobu.ORIENTATION.UP
				when 39 then orientation = Kobu.ORIENTATION.RIGHT
				when 40 then orientation = Kobu.ORIENTATION.DOWN
		
		# Set data and trigger manually while waiting for force option
		if orientation != ''
			@player().set({orientation: orientation}, {silent: true})
			@player().trigger('change:orientation', @player(), orientation, {localTrigger: true})
			return false 
				
	start: ->
		# Setup a Camera
		@camera = new Kobu.Camera(@)
		
		# Load a map
		@map = new Kobu.Map('maps/default.json')
		
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
		@objectLayer.addChild(child)
		
	removeChild: (child) ->
		@objectLayer.removeChild(child)