import { Middleware } from '@nuxt/types'

const LoginCheck: Middleware = (context) => {
  context.redirect(401, '/login')
}

export default LoginCheck
