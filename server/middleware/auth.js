const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1] // lấy phần token phía sau bearer

	if (!token) //co token
		return res
			.status(401) /// Unauthorize
			.json({ success: false, message: 'Access token not found' })

	try { //kiem tra token
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

		req.userId = decoded.userId
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}

module.exports = verifyToken