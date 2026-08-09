import app from './index'
import { env } from './env'

app.listen(env.port)
console.log(`SAIMA API running at http://localhost:${app.server?.port}`)
