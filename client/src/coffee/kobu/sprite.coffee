Kobu.ORIENTATION = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right'
}

class Kobu.Sprite extends PIXI.Sprite
	isPlaying: false
	animationName: 'down'
	currentFrame: 1
	animationSpeed: 0.35
	playOnce: true
	orientation: Kobu.ORIENTATION.DOWN
	
	constructor: (textureId) ->
		# Set sprite ID and texture
		@id = textureId
		texture = PIXI.TextureCache["#{textureId}_down1.png"]
		
		# Extend Backbone events
		_.extend(@, Backbone.Events)
		
		super(texture)
	
	## EVENTS
	setupEvents: ->
		return unless parent?
		
		@parent.on('change:orientation', _.bind(@orientationChanged, @))
		@parent.on('playAnimation', _.bind(@playAnimation, @))
	
	orientationChanged: (orientation) =>
		@orientation = orientation
		@setTexture(PIXI.TextureCache["#{@id}_#{@orientation}1.png"])
	
	## ANIMATION
	playAnimation: (name, once=true) ->
		console.log 'play ' + name
		# TODO We save an animation name but don't use it
		@animationName = name
		@isPlaying = true
		@playOnce = once
	
	stopAnimation: (frame=null) ->
		@isPlaying = false
		
		if frame?
			@setTexture(PIXI.TextureCache["#{@id}_#{frame}1.png"])
		else
			@setTexture(PIXI.TextureCache["#{@id}_#{@orientation}1.png"])
	
	## --		
	updateTransform: ->
		super
		if @isPlaying
			# Increment frame and respects animation speed
			@currentFrame += @animationSpeed
			round = Math.round(@currentFrame)
			
			# Verify if a next frame is available
			if _.has(PIXI.TextureCache, "#{@id}_#{@orientation}#{@animationName}#{round+1}.png")
				@setTexture(PIXI.TextureCache["#{@id}_#{@orientation}#{@animationName}#{round}.png"])
			else
				@currentFrame = 1
				@stopAnimation() if @playOnce
	
	
	## HELPERS
	@getOrientationIncrement: (orientation) ->
		switch orientation
			when Kobu.ORIENTATION.UP then return {x: 0, y: -32}
			when Kobu.ORIENTATION.LEFT then return {x: -32, y: 0}
			when Kobu.ORIENTATION.RIGHT then return {x: 32, y: 0}
			when Kobu.ORIENTATION.DOWN then return {x: 0, y: 32}
	
	@getOrientation: (x, y) ->
		if x > 0 then return Kobu.ORIENTATION.UP
		if x < 0 then return Kobu.ORIENTATION.DOWN
		if y > 0 then return Kobu.ORIENTATION.LEFT
		if y < 0 then return Kobu.ORIENTATION.RIGHT
