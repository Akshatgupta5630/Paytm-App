const express = require('express');
const zod = require('zod');
const { User } = require('../user');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const jwt = require('jsonwebtoken');
const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    username: zod.string()
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = User.findOne({
        username: body.username
    })
    if(user._id){
        return res.json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const dbuser = await User.create({body});
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router;