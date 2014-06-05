class Bomb extends Entity
  className: 'bomb'
  content: ""

  damage: 45

  events:
    'click': 'didClick'

  defaults:
    shape: 'circular'
    radius: 24

  initialize: ->
    @createdAt = new Date()

  isRemoveable: ->
    opacity = @$el.css('opacity')
    parseFloat(opacity, 10) is 0

  explode: (pixels = 10) ->
    @attributes.height += pixels
    @attributes.width  += pixels
    @attributes.radius += pixels / 2

  isExploding: ->
    date = new Date()
    date - @createdAt > 3000

  fade: (dOpacity) ->
    opacity = @attributes.opacity - dOpacity
    opacity = Math.round(opacity * 100) / 100
    opacity = 0 if opacity < 0.0

    @attributes.opacity = opacity

  evaluate: ->
    return unless @isExploding()

    @explode(40)
    @fade(0.4)

    @$el.css @styles()

  didClick: (e) ->
    e.stopPropagation()
