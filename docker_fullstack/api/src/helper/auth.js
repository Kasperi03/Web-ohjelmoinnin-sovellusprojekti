import jwt from 'jsonwebtoken'
const { verify } = jwt
const auth = (req, res, next) => {
    let token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]
    }
    
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' })
        }
        req.user = decoded
        next()
    })
}

export { auth }

