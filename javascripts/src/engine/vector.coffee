class Vector extends Vertex

  # Pythagoras bitch!
  length: ->
    Math.sqrt((@x * @x) + (@y * @y))

  # Subtract
  subtract: (vector) ->
    new Vector(@x - vector.x, @y - vector.y)

  # Divides a vector by a scalar
  divideBy: (scalar) ->
    (@x / scalar) + (@y / scalar)

  # Returns the dot product of a scalar
  dotProductOf: (scalar) ->
    (@x * scalar) + (@y * scalar)
