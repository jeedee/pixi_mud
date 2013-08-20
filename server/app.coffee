global.io = require("socket.io").listen(8000)
Ness = require("../ness/lib/ness") 

class Player extends Ness.NModel
	zone = null
	
	defaults: {
		position: {x: 0, y: 0}
		orientation: 'down',
		type: 0,
		spriteId: '01'
	}
	
	join: (zone) ->
		# Store reference to current zone
		@zone = zone
		
		# Add ourselves to the zone
		global.zones[@zone].add @

	leave: ->
		# Say our goodbyes
		@trigger('sendEveryone', @, 'action', {id: 'remove', data: {id: @get('id')}})
		
		# Remove ourself the zone
		global.zones[@zone].remove @
	
	attack: =>
		@trigger('sendEveryone', @, 'action', {id: 'attack', data: {id: @get('id')}})
	
	networkedAttributes:{
		orientation: {sync: true, read: Ness.EVERYONE}
		position: {sync: true, read: Ness.EVERYONE}
		type: {sync: true, read: Ness.EVERYONE}
		spriteId: {sync: true, read: Ness.EVERYONE}
	}

class Zone extends Ness.NCollection
	

global.zones = {}
global.zones['town'] = new Zone
global.clients = {}

io.sockets.on "connection", (socket) ->
	clients[socket.id] = new Player({id: socket.id, socket: socket})
	clients[socket.id].join('town')

	console.log 'Client connected'
	
	socket.on 'set', (data) ->
		console.log "Client wants to set"
		console.log data
		clients[socket.id].setNetworked(socket, data)

	socket.on 'action', (data) ->
		console.log data
		clients[socket.id].actionRequest(socket, data.id, data)

	socket.on "disconnect", ->
		clients[socket.id].leave()