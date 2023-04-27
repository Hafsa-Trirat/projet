const express = require('express')

const router = express.Router()
const upload = require('../utils/upload')

// Route for handling file uploads
// bassmala, be careful of the name inside single(), it should be written the same way in the front side
router.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({file: req.file});
})

module.exports = router
