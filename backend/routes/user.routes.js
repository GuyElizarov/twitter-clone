import express from 'express'
import { protectRoute } from '../middleware/protectRout.js'
import { getUser, followUnfollowUser,getSuggestedUsers ,updateUser} from '../controllers/user.controller.js'

export const userRoutes = express.Router()

userRoutes.get("/profile/:userName", protectRoute, getUser)
userRoutes.get("/suggested", protectRoute, getSuggestedUsers)
userRoutes.post("/follow/:id", protectRoute, followUnfollowUser)
userRoutes.post("/update", protectRoute, updateUser)
