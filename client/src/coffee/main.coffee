window.Kobu = {}

move = (dir) ->
	target = $("div#" + window.selfId)
	position = {x: target.position().left, y: target.position().top}
	
	switch dir
		when 'up' then position.y -= 1
		when 'down' then position.y += 1
		when 'left' then position.x -= 1
		when 'right' then position.x += 1
	
	window.socket.emit('set', {position: position})

$(document).ready ->
	Kobu.game = new Kobu.Game
	
	#window.socket = io.connect("http://10.0.1.35:8000");
	#
	#window.socket.on('self', (data) ->
	#	window.selfId = data.id
	#)
	#
	#window.socket.on('get', (data) ->
	#	# Creates div if does not exist
	#	if $("div#" + data.id).length == 0
	#		$('body').append("""<div id="#{data.id}"></div>""")
	#	
	#	# Get the target
	#	target = $("div#" + data.id)
	#	
	#	# Sets the correct position
	#	target.css('top', data.position.y)
	#	target.css('left', data.position.x)
	#)
	#
	#$('button').on('click', ->
	#	window.socket.emit('set', {position:{x: 50, y: 50}})
	#)
	#
	#$(document).on('keydown', (e) ->
	#	console.log e.keyCode
	#	switch e.keyCode
	#		when 37 then move('left')
	#		when 38 then move('up')
	#		when 39 then move('right')
	#		when 40 then move('down')
	#)
