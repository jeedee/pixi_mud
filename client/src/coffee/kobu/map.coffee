class Kobu.MapTile extends PIXI.Texture
	tileProperties = {}
	constructor: ->
		super

class Kobu.Map
	constructor: (filename) ->
		# Tiles cache
		@tiles = new Array
		
		# Container for the map
		@container = new PIXI.DisplayObjectContainer
		Kobu.game.world.addChild(@container)
		
		# Load the map
		$.getJSON("#{filename}", @parseMap)
	
	tileProperty: (x, y, property) ->
		if @tilesProperties[x]?[y+1]?[property]?
			return @tilesProperties[x][y+1][property]
		else
			return null
		
	parseMap: (map) =>
		timerStart = Date.now()
		@width = map.width
		@height = map.height
		
		@tilesProperties = [0...@width].map (x)->
		  [0...@height].map (y) ->
		
		# Cache the tiles
		for tileset in map.tilesets
			index = tileset.firstgid
			totalTiles = (tileset.imageheight / tileset.tileheight)*(tileset.imagewidth / tileset.tilewidth)
			for i in [0..totalTiles-1]
				@tiles[index] = @getTile(i, tileset)
				index +=1
		
		# Draw the map
		for z in [0..map.layers.length-1]
			layer = new PIXI.DisplayObjectContainer
			i = 0
			@container.addChild Kobu.game.objectLayer if z == 2
			for y in [0..map.height-1]
				for x in [0..map.width-1]
					idx = map.layers[z].data[i]
					
					# Manage layer draw order
					if map.layers[z].name == 'Meta' || map.layers[z].name == 'meta'
						@tilesProperties[x][y] = @tiles[idx].tileProperties if @tiles[idx]?.tileProperties?
					else
						layer.addChild @makeSprite(idx,x,y) if map.layers[z].data[i] != 0
					
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
		
	getTile: (index, tileset) ->
		horizontalTiles = tileset.imagewidth / tileset.tilewidth
		
		tileX = ~~(index % horizontalTiles)
		tileY = ~~(index / horizontalTiles)
		
		tilesetImage = new PIXI.Texture.fromImage("tiles/#{tileset.name}.png")
		tile = new Kobu.MapTile(tilesetImage, new PIXI.Rectangle(tileX*32,(tileY)*32,32,32))
		
		tile.tileProperties = tileset.tileproperties[index] if tileset.tileproperties?[index]?
		
		return tile
		