class Kobu.Map
	constructor: (filename) ->
		@tiles = new Array
		
		@container = new PIXI.DisplayObjectContainer
		Kobu.game.addChild(@container)
		
		$.getJSON("#{filename}", @parseMap)
	
	parseMap: (map) =>
		timerStart = Date.now()
		@width = map.width
		@height = map.height
		
		# Cache the tiles
		for tileset in map.tilesets
			index = tileset.firstgid
			totalTiles = (tileset.imageheight / tileset.tileheight)*(tileset.imagewidth / tileset.tilewidth)
			horizontalTiles = tileset.imagewidth / tileset.tilewidth
			for i in [0..totalTiles-1]
				@tiles[index] = @getTile(i, tileset.name, horizontalTiles)
				index +=1
		
		# Draw the map
		for z in [0..map.layers.length-1]
			layer = new PIXI.DisplayObjectContainer
			i = 0
			for y in [0..map.height-1]
				for x in [0..map.width-1]
					layer.addChild @makeSprite(map.layers[z].data[i],x,y) if map.layers[z].data[i] != 0
					i += 1
					#console.log "#{x}, #{y}, #{z}"
			@container.addChild(layer)
			i = 0
		
		$('body').append("Loaded in #{Date.now()-timerStart}ms")
	
	makeSprite: (index, x, y) =>
		sprite = new PIXI.Sprite(@tiles[index])
		sprite.position.x = x*32
		sprite.position.y = y*32
		
		return sprite
		
	getTile: (index, tileset, horizontalTiles) ->
		tileX = ~~(index % horizontalTiles)
		tileY = ~~(index / horizontalTiles)
		
		tileset = new PIXI.Texture.fromImage("tiles/#{tileset}.png")
		texture = new PIXI.Texture(tileset, new PIXI.Rectangle(tileX*32,(tileY)*32,32,32))

		return texture
		