const request = require('supertest')
const app = require('express')()
const HomeRoute = require('@/routes/home')

app.use(HomeRoute.endpoint, HomeRoute.router)

test('should done', async () => {
  request(app)
})
