class Kobu.Character extends Backbone.Model
	initialize: (opts) ->
		@sprite = new PIXI.DisplayObjectContainer
		
		# Base sprite
		@_sprite = new Kobu.Sprite(opts.spriteId)
		@sprite.addChild(@_sprite)
		@sprite.position = opts.position
		
		# Set proper orientation
		@_sprite.setOrientation(opts.orientation)
		@on('change:position', @positionChanged)
	
	positionChanged: (model, value, options)->
		console.log "Previous is #{value.x-@previous("position").x}"
		orientation = @_sprite.getOrientation(value.x-@previous("position").x, value.y-@previous("position").y)
		
		
		TweenLite.to(@sprite.position, 0.4, {x: value.x, y: value.y, ease:'Linear.easeNone', onStart: =>
			@_sprite.playAnimation(Kobu.Sprite.orientation[orientation])
		});
		#@sprite.position = value

