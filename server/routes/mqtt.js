const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const model = require('../models/Mqtt')

// @route GET api/testmqtts
// @desc Get mqtt
// @access Private
router.get('/', verifyToken, async (req, res) => {
	try {
		const SimData = await model.SimData.find()
		// const data =([]) 
		// for (let i = 0; i < mqtts.length; i++) {
		// 	data[i] = [mqtts[i].S[0]]
		// }
		// console.log(data)
		res.json({ success: true, SimData})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router