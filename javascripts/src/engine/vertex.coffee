class Vertex
  constructor: (x,y) ->
    [@x, @y] = [x, y]

  vectorWith: (vertex) ->
    vectorX = @x - vertex.x
    vectorY = @y - vertex.y

    new Vector(vectorX, vectorY)
