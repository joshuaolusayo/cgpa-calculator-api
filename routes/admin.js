/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

const router = require('express').Router()
const admin_service = require('../services/admin')

try {
  router
    .post('/register', async (request, __, next) => {
      request.payload = await admin_service.create_record(request, next)
      next()
    })
    .post('/login', async (request, __, next) => {
      request.payload = await admin_service.login(request, next)
      next()
    })
    .post('/password/reset', async (request, __, next) => {
      request.payload = await admin_service.reset_password(request, next)
      next()
    })
} catch (e) {
  console.log(`[Route Error] /admins: ${e.message}`)
} finally {
  module.exports = router
}
