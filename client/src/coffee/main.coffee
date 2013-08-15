window.Kobu = {}

# Implements mixins :)
window.mixOf = (base, mixins...) ->
  class Mixed extends base
  for mixin in mixins by -1
    for name, method of mixin::
      Mixed::[name] = method
  Mixed

$(document).ready ->
	Kobu.game = new Kobu.Main