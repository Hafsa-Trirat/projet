const Topic = require('../models/Topic')
const User = require('../models/User')

const ErrorResponse = require('../utils/ErrorResponse')




//addTopic
exports.addTopic = async (req, res) => {
  //const userr = await User.findOne({ _id: req.user._id });
  const userr = await User.findOne({ _id: req.body.supervisor });
  console.log(userr);
  if (userr.isitStudent) {
    return res.status(401).json({ message: 'not a ' });

  } else {
    try {
      // Query to check if user has already created 3 themes
      const count = await Topic.countDocuments({ supervisor: req.body.supervisor });
      console.log(count);
      if (count >= 3) {
        return res.status(400).json({ message: 'Maximum limit of themes reached' });
      }

      // Create new theme and save
      const topic = new Topic({
        ...req.body,
      //  supervisor: req.user._id // Tie theme with user
      });
      const savedTopic = await topic.save();

      res.status(201).json(savedTopic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding topic: ' + error.message });
    }
  }
};


// Delete a topic by ID

exports.deleteTopic = async (req, res) => {

  const { id } = req.params;
  const userId = req.user._id;

  const deletedTopic = await Topic.findByIdAndDelete(id);
  if (!deletedTopic) {
    return res.status(404).json({ message: 'Topic not found' });
  }

  if (deletedTopic.supervisor.toString() == userId) {

    try {

      res.json(deletedTopic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting topic: ' + error.message });
    }
  }
};





// Update a topic by ID

exports.updateTopic = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Assuming user ID is available in the request object


  const topic = await Topic.findById(id);

  if (!topic) {
    return res.status(404).json({ message: 'Topic not found' });
  }

  if (topic.supervisor.toString() == userId) {    // Check if user is the owner of the topic
    try {

      const updatedTopic = await Topic.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedTopic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      res.json(updatedTopic);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating topic: ' + error.message });
    }
  } else {
    return res.status(403).json({ message: 'Authorization failed: You are not the owner of this topic' });
  }
};


// @desc     get topics 
// @route    Get /api/getAllTopics
// @access   Private
exports.getAllTopics = async (req, res, next) => {
  try {
    // Get all students from the database
    const studentList = await User.find({ isitStudent: 'true' });

    // Loop through each student to get their topics
    const topicsByStudent = await Promise.all(
      studentList.map(async (student) => {
        // Find all topics that match the student's Id
        const topics = await Topic.find({ student: student._id }).populate('supervisor');
        return {
          student,
          topics,
        };
      })
    );

    res.status(200).json(topicsByStudent);
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Error getting topics!', 400));
  }
};


// @desc     choose a topic 
// @route    POST /api/chooseTopic
// @access   Private
exports.chooseTopic = async (req, res, next) => {
  try {
    const { topicId } = req.body;

    // Find the topic the student wants to choose
    const topic = await Topic.findById(topicId);

    // Make sure the topic exists and hasn't already been chosen
    if (!topic) {
      return res.status(404).json({ message: 'Sujet introuvable' });
    }

    if (topic.chosen) {
      return res.status(400).json({ message: 'Ce sujet a déjà été choisi' });
    }

    // Update the chosen flag to true
    topic.chosen = true;

    // Add the student's ID to the supervisor's studentList array
    const supervisor = await User.findById(topic.supervisor);
    supervisor.studentList.push(req.user._id);

    // Save the changes to the database
    await topic.save();
    await supervisor.save();

    res.status(200).json({ message: 'Sujet choisi avec succès' });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse('Erreur du serveur', 500));
  }
};


// @desc     get a topic 
// @route    GET /api/topic
// @access   Private
exports.getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate({ path: 'supervisor', select: 'nom_sujet type_de_recherche methode_proposee population description' })
      .exec();

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Sujet non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse('Erreur du serveur', 500));
  }
};


