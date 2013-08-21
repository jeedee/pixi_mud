global.io = require("socket.io").listen(8000)

_ = require('underscore')

Ness = require("../ness/lib/ness") 
Kobu = {}

Kobu.ORIENTATION = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right'
}

class Kobu.Utils
	@getOrientationIncrement: (orientation) ->
		switch orientation
			when Kobu.ORIENTATION.UP then return {x: 0, y: -1}
			when Kobu.ORIENTATION.LEFT then return {x: -1, y: 0}
			when Kobu.ORIENTATION.RIGHT then return {x: 1, y: 0}
			when Kobu.ORIENTATION.DOWN then return {x: 0, y: 1}


class Player extends Ness.Entity
	defaults: {
		position: {x: 15, y: 30}
		orientation: 'down',
		type: 0,
		spriteId: '01',
		hp: 100,
		totalHp: 100
	}
	
	actionAttack: =>
		# Modify the HP
		increment = Kobu.Utils.getOrientationIncrement(@get('orientation'))
		attackPosition= {x: @get('position').x+increment.x, y:@get('position').y+increment.y}
		
		player = @zone.entityAt(attackPosition)
		
		if player
			newHp = player.get('hp')-5
			player.set({hp: newHp})
		else
			console.log "No one to attack!"
		
		# Send the action
		@zone.sendEveryone('action', {id: 'attack', data: {id: @get('id')}})
	
	actionChat: (data) =>
		text = data.text
		
		if text[0] != '/'
			@zone.sendEveryone('action', {id: 'chat', data: {id: @get('id'), text: data.text}})
		else
			command = text.slice(1).split(' ')[0]
			console.log "Handle command: #{command}"			
	
	networkedAttributes:{
		type: {sync: true, read: Ness.EVERYONE}
		
		# Orientation+position
		orientation: {sync: true, read: Ness.EVERYONE}
		position: {sync: true, read: Ness.EVERYONE}
		# HP
		hp: {sync: true, read: Ness.EVERYONE}
		totalHp: {sync: true, read: Ness.EVERYONE}
		# Sprite IDs
		spriteId: {sync: true, read: Ness.EVERYONE}
	}

class Zone extends Ness.Zone
	entityAt: (position) ->
		entity = _.filter(@models, (model) ->
			model.get('position').x == position.x && model.get('position').y == position.y
		)
		
		if entity.length > 0
			return entity[0]
		else
			return null

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