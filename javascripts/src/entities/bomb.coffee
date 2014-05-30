class Bomb extends Entity
  className: 'bomb'
  content: ""

  damage: 45

  events:
    'click': 'didClick'

  initialize: ->
    @createdAt = new Date()

  isRemoveable: ->
    opacity = @$el.css('opacity')
    parseFloat(opacity, 10) is 0

  isExploding: ->
    date = new Date()
    date - @createdAt > 3000

  frame: ->
    position = @$el.position()
    radius   = @$el.width() / 2
    centerX  = position.left + radius
    centerY  = position.top + radius

    frame = new CircularFrame(
      centerX, centerY, radius
      )

  evaluate: ->
    growth   = 20

    return unless @isExploding()

    position = @$el.position()
    height   = @$el.height() + growth
    width    = @$el.width() + growth

    opacity  = parseFloat(@$el.css('opacity'), 10)
    opacity  = opacity - 0.2
    opacity  = Math.round(opacity * 100) / 100
    opacity  = 0 if opacity < 0.0

    styles =
      top:     position.top - (growth / 2)
      left:    position.left - (growth / 2)
      height:  height,
      width:   width,
      opacity: opacity

    @$el.css styles

  didClick: (e) ->
    e.stopPropagation()
