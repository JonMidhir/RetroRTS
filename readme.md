## Compilation

Compile the JS as such:

```
coffee --join javascripts/application.js --compile javascripts/src/engine javascripts/src/entities javascripts/src/*.coffee
```

Add `--watch` to autocompile when changes are made to JS files:

```
coffee --watch --join javascripts/application.js --compile javascripts/src/engine javascripts/src/entities javascripts/src/*.coffee
```

## Getting Started

Create a new game core and load it when the document is ready.

```
$(document).ready ->

  window.engine = new Core(viewport: '#game_canvas', fps: 30)
  window.engine.run()
```

The game loop is now running and you can interact with it!

Let's create a new object. It'll inherit directly from Entity but we'll change
a few things to make it more interesting.

```
class Bomb extends Entity
  events:
    'click': 'didClick'

  initialize: ->
    @className = 'bomb'

    @createdAt = new Date()

  isRemoveable: ->
    opacity = @$el.css('opacity')
    parseFloat(opacity, 10) is 0

  isExploding: ->
    date = new Date()
    date - @createdAt > 3000

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
```

This is a Bomb that can be placed in the viewport and will go off after 3 seconds,
blowing up and removing itself from the DOM. It has a few other interesting
features.

- It becomes removeable when it's no longer visible.
- A custom `createdAt` variable is defined by overriding the initializer.
- `evaluate()` returns nothing until `isExploding` returns true.
- A simple handler attached to the `click` event stops propagation and thus other bombs being placed in the same spot.
- The object element has a custom 'bomb' class, allowing it to be styled in CSS.

Normally we'd use global game events to trigger actions but since we're only
performing one in this example, let's just listen to an event on the canvas. Add
this to your document ready callback:

```
window.engine.$el.on 'click', (e) ->
  canvasOffset = window.engine.$el.offset()

  x = e.pageX - canvasOffset.left
  y = e.pageY - canvasOffset.top

  bomb = new Bomb()

  window.engine.addEntity(bomb, {x: x, y: y})
```

Tick, tock. Tick, tock...

## API

The game engine provides a number of objects you can use as a basis to build
simple games quickly in Javascript.

#### Core

This is the module that manages your canvas and adds the core infrastructure for
the operation of the engine.

###### run()

Start the game loop.

###### pause()

Pause the game loop.

###### stop()

Stop the loop, returning counts to zero and resetting the game.

###### addEntity()

Add an Entity or sub-Entity to the game canvas.

###### removeEntity()

Remove an Entity or sub-Entity from the game canvas.

###### frame()

Returns the frame of the viewport.

#### Entity

A top-level generic object that can be added to the core viewport & can interact
with the viewport and other entities.

###### initialize()

Called when an Entity is created, can be used for basic setup.

###### render()

Return a jQuery object that can be inserted into the DOM.

###### template()

Returns a HTML string representing the sprite or view object.

###### set()

Setter for changing variables. Implements dirty attributes.

###### frame()

Returns the frame of the viewport.

###### evaluate()

Called in every frame of the game loop.

###### willRegister()

Called before the Entity is registered with the game core.

###### isRemoveable()

Returns true if the object has expired and can be closed.

###### close()

A release/teardown method to unbind and remove the DOM element.
