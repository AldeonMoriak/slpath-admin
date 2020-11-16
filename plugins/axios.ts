import { Context } from '@nuxt/types'

export default function (context: Context) {
  context.$axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })

  context.$axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
