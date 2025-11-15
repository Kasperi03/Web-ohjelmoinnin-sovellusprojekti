import {createAccount, checkPassword } from "../models/login_model.js";

export async function createUser(req, res, next) {
try {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await createAccount(req.body.email, req.body.password)
    return res.status(201).json(user)
}
catch (err) {
next(err)
}
}

export async function loginUser(req, res, next) {
try {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await checkPassword(req.body.email , req.body.password)
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' })
}
    return res.status(200).json({ message: 'Login successful' })
}
catch (err) {
next(err)
}
}