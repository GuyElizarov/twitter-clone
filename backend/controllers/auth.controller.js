import bcrypt from "bcryptjs"

import { generateTokenAndCookie } from "../lib/utils/generatTokken.js"
import { User } from "../models/user.model.js"

export const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body

        const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        const existingUser = await User.findOne({ userName })
        if (existingUser) {
            return res.status(400).json({ error: "User name is already taken" })
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in taken" })
        }

        if (password < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateTokenAndCookie(newUser, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error) {
        console.log('error in the signup controller', error.massage)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        generateTokenAndCookie(user.id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })

    } catch (error) {
        console.log('error in the login controller', error.massage)
        res.status(500).json({ error: "Internal server error" })
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ massage: 'You logged out successfully' })

    } catch (error) {
        console.log('error in the logout controller', error.massage)
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getAuthUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}