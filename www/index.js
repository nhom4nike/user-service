// load environment variables
const dotenv = require('dotenv')
if (process.env.NODE_ENV === 'production') dotenv.config()
else dotenv.config({ path: '.env.development' })

const server = require('../src/app')

// start server
server.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
)
