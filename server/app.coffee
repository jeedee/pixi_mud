global.io = require("socket.io").listen(8000)
Ness = require("../ness/lib/ness") 

class Player extends Ness.Entity
	defaults: {
		position: {x: 15, y: 30}
		orientation: 'down',
		type: 0,
		spriteId: '01'
	}
	
	actionAttack: =>
		@zone.sendEveryone('action', {id: 'attack', data: {id: @get('id')}})
	
	actionChat: (data) =>
		text = data.text
		
		if text[0] != '/'
			@zone.sendEveryone('action', {id: 'chat', data: {id: @get('id'), text: data.text}})
		else
			command = text.slice(1).split(' ')[0]
			console.log "Handle command: #{command}"			
	
	networkedAttributes:{
		orientation: {sync: true, read: Ness.EVERYONE}
		position: {sync: true, read: Ness.EVERYONE}
		type: {sync: true, read: Ness.EVERYONE}
		spriteId: {sync: true, read: Ness.EVERYONE}
	}

class Zone extends Ness.Zone
	

global.zones = {}
global.zones['town'] = new Zone
global.clients = {}

io.sockets.on "connection", (socket) ->
	clients[socket.id] = new Player({id: socket.id, socket: socket})
	clients[socket.id].join(global.zones['town'])
	
	socket.on 'set', (data) ->
		clients[socket.id].setNetworked(data)

	socket.on 'action', (data) ->
		clients[socket.id].actionRequest(data.id, data.data)

	socket.on "disconnect", ->
		clients[socket.id].leave()