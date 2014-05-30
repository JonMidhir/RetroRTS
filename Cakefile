fs     = require 'fs'
{exec} = require 'child_process'

appFiles  = [
  # omit src/ and .coffee to make the below lines a little shorter
  'engine/core'
  'engine/entity'
  'engine/map'
  'engine/vertex'
  'engine/vector'
  'engine/rectangular_frame'
  'engine/circular_frame'

  'entities/bomb'
  'entities/soldier'

  'loader'
]

task 'build', 'Build single application file from source files', ->
  appContents = new Array remaining = appFiles.length
  for file, index in appFiles then do (file, index) ->
    fs.readFile "javascripts/src/#{file}.coffee", 'utf8', (err, fileContents) ->
      throw err if err
      appContents[index] = fileContents
      process() if --remaining is 0
  process = ->
    fs.writeFile 'javascripts/application.coffee', appContents.join('\n\n'), 'utf8', (err) ->
      throw err if err
      exec 'coffee --compile javascripts/application.coffee', (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr
        fs.unlink 'javascripts/application.coffee', (err) ->
          throw err if err
          console.log 'Done.'
