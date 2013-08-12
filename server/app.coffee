global.io = require("socket.io").listen(8000)
Ness = require("../ness/lib/ness") 

class Player extends Ness.NModel
	zone = null
	
	initialize: ->
		@set('position', {x: 12, y: 15})
		super
	
	join: (zone) ->
		# Store reference to current zone
		@zone = zone
		
		# Add ourselves to the zone
		global.zones[@zone].add @

	leave: ->
		# Remove ourself the zone
		global.zones[@zone].remove @
	
	networkedAttributes:{
		position: {sync: true, read: Ness.EVERYONE}
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
		clients[socket.id].setNetworked(socket, data)

	socket.on "disconnect", ->
		clients[socket.id].leave()