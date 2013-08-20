class Kobu.Network
	constructor: ->
		@socket = io.connect("http://72.11.167.69:8000");
		
		# Bind events
		@socket.on('self', _.bind(@selfRequest, @))
		@socket.on('get', _.bind(@getRequest, @))
		@socket.on('action', _.bind(@actionRequest, @))
	
	setRequest: (id, data) ->
		@socket.emit('set', data)
	
	selfRequest: (data) ->
		Kobu.game.playerId = data.id
	
	getRequest: (data) ->
		if data.id?
			Kobu.game.characterGroup.findOrCreate(data)
		
	## ACTION
	sendAction: (id, data) ->
		request = {id: id, data: data}	
		@socket.emit('action', request)
	
	actionRequest: (request) ->
		action = request.id.charAt(0).toUpperCase() + request.id.slice(1)
		data = request.data if request.data?
		
		fn = @["action#{action}"]
		if typeof fn is 'function'
			fn(data)
		else
			console.log "Server sent an unsupported RPC! #{action}"
			
	
	## ACTIONS!
	actionAttack: (data) ->
		Kobu.game.characterGroup.get(data.id).attack(false)

	actionRemove: (data) ->
		console.log 'removing'
		Kobu.game.characterGroup.remove(data.id)