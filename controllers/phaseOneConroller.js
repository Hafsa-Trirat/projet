const PhaseOne = require('../models/PhaseOne')
const User = require('../models/User')
const upload = require('../utils/upload')

const ErrorResponse = require('../utils/ErrorResponse')



// @desc     submit  the first phase
// @route    POST /api/SubmitPhaseOne
// @access   Private
exports.submitphaseOne = async(req, res, next) => {
  try{
   const { etat_de_savoir, problematique, choix_de_recherche,bibliographie, supervisorId} = req.body

   const supervisor = await User.findOne({ _id: supervisorId, isitStudent: false });

  // Check if the supervisor exists
  if (!supervisor) {
    return next(new ErrorResponse('Supervisor not found!', 404));
  }

   const phase1 = new PhaseOne({
    student: req.user._id,
    supervisor: supervisorId,
    etat_de_savoir,
    problematique,
    choix_de_recherche,
    bibliographie

   })
   // Check if there are files to upload
   if (req.files) {
      // Check if there are more than three files uploaded
      if (req.files.length > 3) {
        return next(new ErrorResponse('You can upload only three files!', 400));
      }

      // Upload the files using the 'upload' function
      const uploadedFiles = await upload(req.files);

      // Add the file URLs to the PhaseOne document
      phase1.files = uploadedFiles;
    }
   const submitphase1 = await phase1.save()
   // Respond with the saved document
   res.status(201).json(submitphase1);
  } catch (error) {
   console.error(error);
   next(new ErrorResponse('Error submitting first phase!', 400))
  }
};



// @desc     get phase1 
// @route    GET /api/
// @access   Private

exports.getStudentPhaseOne = async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const { _id: supervisorId } = req.user;
  
      // Find the student and phase one submission
      const phaseOnes = await PhaseOne.findOne({
        students: studentId,
        supervisor: supervisorId
      }).populate('student', 'nom prenom email')
        .populate('supervisor', 'nom prenom email')
        .select('etat_de_savoir problematique choix_de_recherche bibliographie');
        ;
  
       // Check if any phase one submissions exist
       if (phaseOnes.length === 0) {
        return next(new ErrorResponse('Phase one submissions not found!', 404));
    }
  
      res.status(200).json(phaseOnes);
    } catch (error) {
      console.error(error);
      next(new ErrorResponse('Error getting phase one submission!', 400));
    }
  };
  