class Entity
  content: ''
  className: 'entity'
  tagName: 'div'

  events: {}

  defaults: {}

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
    globalDefaults =
      x:      0
      y:      0
      width:  48
      height: 48
      radius: 0
      opacity: 1.0
      collidable: true
      shape: 'rectangle'

    @_defaults  = _.clone(@defaults)
    @_defaults  = _.defaults(@_defaults, globalDefaults)
    @attributes = _.defaults(options, @_defaults)

    @el  = @template()
    @$el = $(@el)

    @$el.css(@styles())

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
    if @attributes.shape is 'circular'
      new CircularFrame(
        @attributes.x,
        @attributes.y,
        @attributes.radius
      )
    else
      new RectangularFrame(
        @attributes.x,
        @attributes.y,
        @attributes.x + @attributes.width,
        @attributes.y + @attributes.height
        )

  isCollidable: -> @attributes.collidable

  # Returns a set of styles for the .css() method
  styles: ->
    position: 'absolute'
    top:      @attributes.y - (@attributes.height / 2)
    left:     @attributes.x - (@attributes.width / 2)
    height:   @attributes.height
    width:    @attributes.width
    opacity:  @attributes.opacity

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
    # console.log "removing entity"
    @$el.remove()
