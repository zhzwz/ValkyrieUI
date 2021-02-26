import valkyrie from './valkyrie'

valkyrie.on('send', function(data) {
  console.log(data.command)
})

valkyrie.on('roles', function(data) {
  console.log(data)
})
