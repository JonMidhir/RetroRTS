$(document).ready ->

  window.engine = new Core(viewport: '#game_canvas', fps: 30)
  window.engine.run()

  window.engine.$el.on 'click', (e) ->
    canvasOffset = window.engine.$el.offset()

    x = e.pageX - canvasOffset.left
    y = e.pageY - canvasOffset.top

    if e.shiftKey
      solider = window.engine.addEntity(new Soldier(), {x: x, y: y})
    else
      bomb = window.engine.addEntity(new Bomb(), {x: x, y: y})
