const express = require ('express')
const router = express.Router()

const { addTopic, deleteTopic, updateTopic } = require('../controllers/topicController');
//const authMiddleware1 = require('../middlewares/authMiddleware')
// Add a new topic
router.post('/add-topics', addTopic);

// Update a topic by ID
//router.put('/update-topics/:id', authMiddleware1.authMiddleware, updateTopic);

// Delete a topic by ID
//router.delete('/delete-topics/:id', authMiddleware1.authMiddleware, deleteTopic);

//router.get('/recupererThemes',authMiddleware, recupererThemes);

module.exports = router;


