class Kobu.Character extends Backbone.Model
	isOwner: false
	_moving: false
	
	bubbleTimeout = null
	isTyping = false
	
	initialize: (opts) ->
		@sprite = new PIXI.DisplayObjectContainer
		
		# Cache the chat bubble
		@chatBubble = new PIXI.DisplayObjectContainer
		@sprite.addChild @chatBubble
		
		_.extend(@sprite, Backbone.Events)
		
		# Triggers
		@on('change:spriteId', @spriteIdChanged)
		@on('change:typing', @typing)
		@on('change:position', @positionChanged)
		@on('change:orientation', @orientationChanged)
		
		@on('change:hp', @hpChanged)

	
	## Sprites & Display
	# TODO: THIS SUCKS!
	spriteIdChanged: (model, spriteId, options) =>
		@_sprite = new Kobu.Sprite(spriteId)
		
		@sprite.addChild(@_sprite)
		
		@_sprite.setupEvents()
	
	## Attack
	attack: (local=true) ->
		@sprite.trigger('playAnimation', 'attack')
		Kobu.game.network.sendAction('attack', {}) if local
	
	## Chat related
	toggleChat: ->
		if @isTyping then @isTyping = false else @isTyping= true

		if @isTyping
			$('#chat').focus()
		else
			text = $('#chat').val()
			console.log text
			Kobu.game.network.sendAction('chat', {text: text})
			
			$('#chat').val('')
			$('#chat').blur()
	
	sayText: (content) =>
		window.clearTimeout(@bubbleTimeout) if @bubbleTimeout?
		@bubbleTween.kill() if @bubbleTween?
		
		# TODO : Add text & scale properly 
		if @chatBubble.children.length > 0
			console.log @chatBubble.children
			@chatBubble.removeChild @chatBubble.getChildAt 0
			@chatBubble.removeChild @chatBubble.getChildAt 0
		
		# The text
		text = new PIXI.Text(content, {font:"11px Arial", fill:"white", wordWrap: true, wordWrapWidth: 110, stroke: 'black', strokeThickness: 1});
		text.position.x = -35
		text.position.y = -70
		
		# The Rectangle
		rectangle = new PIXI.Graphics
		rectangle.alpha = 0.5
		rectangle.beginFill(0x000000);
		rectangle.drawRect(0, 0, 120, text.height);
		
		rectangle.moveTo(45, text.height);
		rectangle.lineTo(60, text.height+10);
		rectangle.lineTo(75, text.height);
		
		rectangle.position.x = -45
		rectangle.position.y = -70
		
		@chatBubble.alpha = 1
		@chatBubble.addChild rectangle
		@chatBubble.addChild text
		
		@bubbleTimeout = window.setTimeout(_.bind(@clearBubble, @), 3000)
	
	clearBubble: ->
		@bubbleTween = TweenLite.to(@chatBubble, 1, {alpha: 0, ease:'Linear.easeNone'})
	
	## Object Depth
	manageObjectDepth: ->
		# Will fix later, pixi depth sucks
		return
		
		increment = Kobu.Sprite.getOrientationIncrement(Kobu.ORIENTATION.UP)
		
		upPosition = {x: @get('position').x+increment.x, y:@get('position').y+increment.y}
		
		objectsAbove = _.filter(Kobu.game.networkObjects.models, (model) ->
			model.get('position').x == upPosition.x && model.get('position').y == upPosition.y
		)
		
		for entity in objectsAbove
			if Kobu.game.objectLayer.children.indexOf(entity.sprite) > Kobu.game.objectLayer.children.indexOf(@sprite)
				console.log Kobu.game.objectLayer.children.indexOf(entity.sprite)
				console.log Kobu.game.objectLayer.children.indexOf(@sprite)
				Kobu.game.objectLayer.swapChildren(entity.sprite, @sprite)
				console.log 'swapped'
	
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
			if not Kobu.game.map.tileProperty(newPosition.x, newPosition.y, 'WALKABLE')
				@set({position: newPosition}, {localTrigger: true})
	
	## Position
	positionChanged: (model, value, options)->
		if options.localTrigger?
			Kobu.game.network.setRequest(0, {position: value})
		
		@manageObjectDepth()
		
		if @previous('position')
			TweenLite.to(@sprite.position, 0.4, {x: value.x*32, y: value.y*32, ease:'Linear.easeNone', onStart: =>
				@sprite.trigger('playAnimation', '')
				@_moving = true
			, onComplete: =>
				@_moving = false
			})
		else
			@sprite.position = {x: value.x*32, y: value.y*32}
	
	## Health
	showHpBar: (percent) ->
		window.clearTimeout(@hpTimeout) if @hpTimeout?
		@hpTween.kill() if @hpTween?
		
		@sprite.removeChild @healthBar if @healthBar?
		
		# The Rectangle
		@healthBar = new PIXI.Graphics
		@healthBar.beginFill(0xff0000);
		@healthBar.drawRect(0, -10, percent / 3, 5);
		@sprite.addChild @healthBar
		
		# Clear bar
		@hpTimeout = window.setTimeout(_.bind(@clearHpBar, @), 3000)
	
	clearHpBar: ->
		@hpTween = TweenLite.to(@healthBar, 1, {alpha: 0, ease:'Linear.easeNone'})
	
	hpChanged: (model, value, options) ->
		healthPercent = @get('hp')*100 / @get('totalHp')
		
		if @isOwner
			$('div#health').text("#{@get('hp')}")
			$('div#health').css("width", "#{healthPercent}px")
		
		@showHpBar(healthPercent) if healthPercent < 100
	
	## Owner
	setOwner: (tf) ->
		@isOwner = tf
		
		# Force hp display
		@trigger('change:hp')

