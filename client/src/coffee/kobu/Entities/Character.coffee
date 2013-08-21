class Kobu.Character extends Backbone.Model
	isOwner: false
	
	_moving: false
	
	initialize: (opts) ->
		@sprite = new PIXI.DisplayObjectContainer
		_.extend(@sprite, Backbone.Events)
		
		# Triggers
		@on('change:spriteId', @spriteIdChanged)
		@on('change:position', @positionChanged)
		@on('change:orientation', @orientationChanged)
	
	## Sprites & Display
	# TODO: THIS SUCKS!
	spriteIdChanged: (model, spriteId, options) =>
		@_sprite = new Kobu.Sprite(spriteId)
		
		@sprite.addChild(@_sprite)
		
		@_sprite.setupEvents()
	
	## Attack
	attack: (local=true)->
		@sprite.trigger('playAnimation', 'attack')
		Kobu.game.network.sendAction('attack', {}) if local
	
	## Orientation
	orientationChanged: (model, orientation, options) ->
		# If it has changed
		if @previous('orientation') != orientation
			@sprite.trigger('change:orientation', orientation)
			
			# Send network request if it has been locally triggered
			Kobu.game.network.setRequest(0, {orientation: orientation}) if options.localTrigger?
		
		# If 
		if @isOwner && @previous('orientation') == orientation && !@_moving
			# Compute new position
			increment = Kobu.Sprite.getOrientationIncrement(orientation)
			newPosition = {x: @get('position').x+increment.x, y:@get('position').y+increment.y}
			
			# Check for walkability
			console.log "Checking at #{newPosition.x} #{newPosition.y}"
			if not Kobu.game.map.tileProperty(newPosition.x, newPosition.y, 'WALKABLE')
				@set({position: newPosition}, {localTrigger: true})
	
	## Position
	positionChanged: (model, value, options)->
		if options.localTrigger?
			Kobu.game.network.setRequest(0, {position: value})
		
		if @previous('position')
			TweenLite.to(@sprite.position, 0.4, {x: value.x*32, y: value.y*32, ease:'Linear.easeNone', onStart: =>
				@sprite.trigger('playAnimation', '')
				@_moving = true
			, onComplete: =>
				@_moving = false
			})
		else
			@sprite.position = {x: value.x*32, y: value.y*32}
		
	## Owner
	setOwner: (tf) ->
		@isOwner = tf

