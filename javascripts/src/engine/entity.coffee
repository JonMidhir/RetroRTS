class Entity
  content: ''
  className: 'entity'
  tagName: 'div'
  width: 48
  height: 48
  collidable: true

  events: {}

  # Set the default attributes hash
  constructor: (attributes = {}) ->
    @changed      = {}
    @interactions = []
    @attributes   = attributes

    @initialize()

    this

  # Public method for user defined initialization
  initialize: (options = {}) ->
    this

  # Render template with styles
  render: (options = {}) ->
    # Todo: Make these class variable?
    defaults =
      x: 0
      y: 0

    _.extend(defaults, options)

    @el  = @template()
    @$el = $(@el)

    styles =
      position: 'absolute'
      top:      defaults.y - (@height / 2)
      left:     defaults.x - (@width / 2)

    @$el.css(styles)

    console.log @events

    for event, callback of @events
      @$el.on event, {}, @[callback]

    @$el

  # Must return a HTML object
  template: ->
    "<#{@tagName} class='#{@className}'>#{@content}</#{@tagName}>"

  # Backbone style set, uses dirty attributes
  set: (attributes = {}) ->
    changedKeys = _.keys(attributes)
    @changed    = _.pick(@attributes, changedKeys)

    _.extend(@attributes, attributes)

  # Returns the frame of this entity
  frame: ->
    position = @$el.position()

    new RectangularFrame(
      position.left,
      position.top,
      position.left + @$el.width(),
      position.top + @$el.height()
      )

  # Evaluate is run once per frame when the entity is registered
  evaluate: ->
    this

  # Called when the object is registered, must return something or registration
  # will fail.
  willRegister: ->
    this

  # Temporary method, is interacting with another entity or world object
  interactWith: (entity) ->
    unless entity.worldId in @interactions
      @interactions.push entity.worldId
      @takeDamage(entity.damage) if entity.dealsDamage()

  # Take damage from another entity
  takeDamage: (damage) ->
    this

  # Does the current entity deal damage
  dealsDamage: -> @damage?

  # A getter to queue this for removal in the next frame
  isRemoveable: ->
    false

  # Remove from the DOM
  close: ->
    console.log "removing entity"
    @$el.remove()
