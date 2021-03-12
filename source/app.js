import { getValue } from './common'

const app = Vue.createApp({
  data() {
    return {
      id: '',
      name: '',
      server: '',

      options: {
        activeTitle: true,

      },
    }
  },
  computed: {
    state() {
      return `${Valkyrie.state.text1} ${Valkyrie.state.text2}`
    },
    documentTitle() {
      return `${this.name} ${this.state} ${this.server}`
    },
    channels() {
      return Valkyrie.channel.list
    },
    channelMessageCount() {
      return this.channels.length
    },

  },
  watch: {
    id(value) {
      const role = getValue(value)
      this.name = role.name
      this.server = role.server
    },
    documentTitle(value) {
      document.title = value
    },

    async channelMessageCount() {
      await Vue.nextTick()
      document.querySelector('.v-channel-scroll').scrollIntoView({ behavior: 'smooth' })
    },
  },
  methods: {

  },
})

export default app
