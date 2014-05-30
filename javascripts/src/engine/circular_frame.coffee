class CircularFrame
  constructor: (x, y, radius) ->
    [@x, @y, @radius] = [x, y, radius]

  # Central vertex
  centerVertex: ->
    new Vertex(@x, @y)

  # Determines NO overlap at all between self and the frame
  isExcluding: (excludable) ->
    if excludable instanceof Vertex
      not @isOverlapping(excludable)
    else if excludable instanceof CircularFrame
      # Vertical and horizontal distances between circle centers
      dx = @x - excludable.x
      dy = @y - excludable.y

      # Determine the straight-Line distance between the centers.
      distance = Math.sqrt((dy*dy) + (dx*dx))

      # No intersection
      distance > (@radius + excludable.radius)
    else if excludable instanceof RectangularFrame
      not @isOverlapping(excludable)

  # Determines some overlap between self and frame
  isOverlapping: (excludable) ->
    if excludable instanceof Vertex
      squareDistance = Math.pow(@x - excludable.x, 2) + Math.pow(@y - excludable.y, 2)
      squareDistance < @radius
    else if excludable instanceof CircularFrame
      @isExcluding(excludable)
    else if excludable instanceof RectangularFrame
      vertices = excludable.vertices()

      topLeftV = vertices[0]
      topRightV = vertices[1]

      distance = @intersectionWith(topRightV, topLeftV)
      console.log distance.length()

      # is the centralVertex in the rectangle?
      excludable.isExcluding(@centerVertex()) or
      # or does any rect vertex intersect this circle?
      @isExcluding(vertices[0]) and @isExcluding(vertices[1]) and
      @isExcluding(vertices[2]) and @isExcluding(vertices[3])

  # Determines intersection with a line,
  # see: http://doswa.com/2009/07/13/circle-segment-intersectioncollision.html
  intersectionWith: (v1, v2) ->
    segVector = v1.vectorWith(v2)
    cVector   = v1.vectorWith(@centerVertex())

    segLength = segVector.length()
    segVUnit  = segVector.divideBy(segLength)

    proj      = cVector.dotProductOf(segVUnit)

    if proj <= 0
      closest = v1
    else if proj > segLength
      closest = v2
    else
      projV = segVUnit * proj

      closest = [v1.x + projV, v2 + projV]

    distanceV = cVector.subtract(closest)
