class Kobu.Sprite extends PIXI.Sprite
	isPlaying: false
	animationName: 'down'
	currentFrame: 1
	animationSpeed: 0.35
	playOnce: true
	
	constructor: (textureId) ->
		@id = textureId
		texture = PIXI.TextureCache["#{textureId}_down1.png"]
		super(texture)
	
	playAnimation: (name, once=true) ->
		@animationName = name
		@isPlaying = true
		@playOnce = once
	
	setOrientation: (id) ->
		@setTexture(PIXI.TextureCache["#{@id}_#{Kobu.Sprite.orientation[id]}1.png"])
	
	stopAnimation: (frame=null)->
		@isPlaying = false
		
		if frame?
			@setTexture(PIXI.TextureCache["#{@id}_#{frame}1.png"])
		else
			@setTexture(PIXI.TextureCache["#{@id}_#{@animationName}1.png"])
			
	updateTransform: ->
		super
		if @isPlaying
			# Increment frame and respects animation speed
			@currentFrame += @animationSpeed
			round = Math.round(@currentFrame)
			
			# Verify if a next frame is available
			if _.has(PIXI.TextureCache, "#{@id}_#{@animationName}#{round+1}.png")
				@setTexture(PIXI.TextureCache["#{@id}_#{@animationName}#{round}.png"])
			else
				@currentFrame = 1
				@stopAnimation() if @playOnce
	
	
	## HELPERS
	getOrientation: (x, y) ->
		if x > 0 then return 3
		if x < 0 then return 2
		if y > 0 then return 1
		if y < 0 then return 0

Kobu.Sprite.orientation = {
	0: 'up',
	1: 'down',
	2: 'left',
	3: 'right'
}