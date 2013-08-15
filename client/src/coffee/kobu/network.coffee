class Kobu.Network
	constructor: ->
		@socket = io.connect("http://72.11.167.69:8000");
		
		# Bind events
		@socket.on('self', _.bind(@selfRequest, @))
		@socket.on('get', _.bind(@getRequest, @))
	
	setRequest: (id, data) ->
		@socket.emit('set', data)
	
	selfRequest: (data) ->
		Kobu.game.playerId = data.id
	
	getRequest: (data) ->
		if data.id?
			Kobu.game.characterGroup.findOrCreate(data)