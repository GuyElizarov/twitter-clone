import express from 'express'
import { getAuthUser, login, logout, signup } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/protectRout.js'

export const authRoutes = express.Router()

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.post("/logout", logout)
authRoutes.get("/getAuthUser", protectRoute, getAuthUser)