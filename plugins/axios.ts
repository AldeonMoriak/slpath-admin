export default function (context: any) {
  context.$axios.onResponse((config: any) => {
    console.log(config.status)
    if (config.status === 401) context.redirect('/login')
  })

  context.$axios.onError((error: any) => {
    console.log(error.response.status)
    const code = parseInt(error.response.status, 10)
    if (code === 401) {
      context.$auth.reset()
      context.redirect('/login')
    }
  })
}
