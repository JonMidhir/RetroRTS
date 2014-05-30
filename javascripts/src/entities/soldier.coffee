class Soldier extends Entity
  className: 'soldier'
  width: 12
  height: 24
  events:
    'click': 'didClick'

  initialize: ->
    @health = 100
    @diedAt = null

  isRemoveable: ->
    opacity = @$el.css('opacity')
    parseFloat(opacity, 10) is 0

  takeDamage: (damage) ->
    console.log "#{@worldId}: I'm taking damage!"
    @health -= damage
    @kill() if @health <= 0 and not @isDead()

  kill: ->
    console.log "Officer down!"
    @diedAt = new Date()
    @$el.css('background-color', 'black')

  isDead: -> @diedAt?

  evaluate: ->
    timePassed = (new Date() - @diedAt)
    return unless @isDead() and timePassed > 1000

    opacity  = parseFloat(@$el.css('opacity'), 10)
    opacity  = opacity - 0.05
    opacity  = Math.round(opacity * 100) / 100
    opacity  = 0 if opacity < 0.0

    @$el.css(opacity: opacity)

  didClick: (e) ->
    e.stopPropagation()
