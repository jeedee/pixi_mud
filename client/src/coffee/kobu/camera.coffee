class Kobu.Camera
	constructor: (game) ->
		@position = new PIXI.Point
		@target = null
	pan: (x, y) ->
		@position.x += x
		@position.y -= y
	
	update: ->
		# Update code
		if (@target?)
			@position.x = Math.round(-@target.position.x + (900 / 2))
			@position.y = Math.round(-@target.position.y + (700 / 2))
		
		Kobu.game.world.position.x = @position.x
		Kobu.game.world.position.y = @position.y
			
