import Valkyrie from '../../library/Valkyrie'

Valkyrie.on('roles', function(data) {
  if (data.roles instanceof Array) {
    data.roles.forEach(role => {
      const { name, title, id } = role
      this.roles[id] = this.roles[id] || Object()
      this.roles[id].name = name
      this.roles[id].title = title
    })
  }
  console.log(Object.assign(Object(), this.roles))
})
