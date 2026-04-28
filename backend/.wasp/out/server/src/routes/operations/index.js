import express from 'express'

import auth from 'wasp/core/auth'

import updateIsUserAdminById from './updateIsUserAdminById.js'
import getPaginatedUsers from './getPaginatedUsers.js'

const router = express.Router()

router.post('/update-is-user-admin-by-id', auth, updateIsUserAdminById)
router.post('/get-paginated-users', auth, getPaginatedUsers)

export default router
