class RectangularFrame
  constructor: (left, top, right, bottom) ->
    [@left, @top, @right, @bottom] = [left, top, right, bottom]

  # Vertices of points top-left, top-right, bottom-right, bottom-left
  vertices: ->
    [
      new Vertex(@left, @top),
      new Vertex(@right, @top),
      new Vertex(@right, @bottom),
      new Vertex(@left, @bottom)
    ]

  # Determines NO overlap at all between self and the frame
  isExcluding: (excludable) ->
    if excludable instanceof Vertex
      not (@left <= excludable.x <= @right and
      @top <= excludable.y <= @bottom)
    else if excludable instanceof RectangularFrame
      excludable.right  < @left or
      excludable.left   > @right or
      excludable.top    > @bottom or
      excludable.bottom < @top
    else if excludable instanceof CircularFrame
      vertices = @vertices()

      # is the centralVertex in this rectangle?
      @isExcluding(excludable.centerVertex()) and
      # or does any rect vertex intersect the circle?
      excludable.isExcluding(vertices[0]) and
      excludable.isExcluding(vertices[1]) and
      excludable.isExcluding(vertices[2]) and
      excludable.isExcluding(vertices[3])

  # Determines some overlap between self and frame
  isOverlapping: (frame) -> not @isExcluding(frame)
