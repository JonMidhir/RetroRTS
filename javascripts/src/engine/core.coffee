class Core

  constructor: (attributes = {}) ->
    @entities    = []
    @entityCount = 0
    @frameCount  = 0

    defaults =
      fps:      60
      viewport: document

    _.extend(defaults, attributes)

    @attributes = defaults
    @el         = @attributes.viewport
    @$el        = $(@el)

    this

  # Start the loop that runs the game
  run: ->
    @loopProcessId = setInterval(@getFrame, 1000 / @attributes.fps)

  # Stop the loop
  stop: ->
    clearInterval(@loopProcessId)
    @loopProcessId = null

  # Register an entity
  addEntity: (entity, options = {}) ->
    $view = entity.render(options)

    if entity.willRegister()
      ++@entityCount
      entity.worldId = "c#{@entityCount}"
      @entities.push entity
      @$el.append($view) if $view

  # Remove an entity
  removeEntity: (entity) ->
    @entities = _.without(@entities, entity)
    entity.close()

  # frame of the viewport
  frame: ->
    @f ?= new RectangularFrame(0, 0, @$el.width(), @$el.height())

  # Check if a frame is outside viewport
  isOutsideViewport: (frame) ->
    vpFrame = @frame()

    vpFrame.isExcluding(frame)

  # private

  # Evaluate each entity's state
  getFrame: =>
    ++@frameCount
    for entity in @entities
      @checkCollisions(entity) if entity.isCollidable()
      @evaluateEntity(entity)

  # Evaluate a single entity
  evaluateEntity: (entity) ->
    entity.evaluate()

    if entity.isRemoveable() or @isOutsideViewport(entity.frame())
      @removeEntity(entity)

  # Check other collidables in the world for overlap
  checkCollisions: (entity) ->
    for e in @entities when e isnt entity and e.isCollidable()
      # vertex = entity.frame()?.centerVertex() if entity.worldId is 'c2'
      # console.log "Checking #{entity.worldId}: [#{vertex.x}, #{vertex.y}] r:#{entity.frame().radius} is overlapping #{e.worldId}" if entity.worldId is 'c2'
      # console.log entity.frame().isOverlapping(e.frame()) if entity.worldId is 'c2'

      if entity.frame().isOverlapping(e.frame())
        console.log "make damage"
        entity.interactWith(e)
