// const PhaseTwo = require('../models/PhaseTwo')

// const checkFirstPhaseSubmission = require('../middlewares/checkphaseone')


// // // unless the first phase is validated, he can access the second ..
// // // @desc     submit  the second phase
// // // @route    POST /api/PhaseTwo
// // // @access   Private
// exports.submitPhaseTwo = (checkFirstPhaseSubmission, async (req, res, next) => {
//     try {
//       const { studentId } = req.params;
//       const { _id: supervisorId } = req.user;
  
//       // Find the student's first phase submission
//       const phaseOne = await PhaseOne.findOne({
//         student: studentId,
//         supervisor: supervisorId
//       });
  
//       // Check if phase one submission exists
//       if (!phaseOne) {
//         return next(new ErrorResponse('Phase one submission not found!', 404));
//       }
//       if (req.files) {
//         // Upload the files using the 'upload' function
//         const uploadedFiles = await upload(req.files);
  
//         // Add the file URLs to the PhaseOne document
//         phase2.files = uploadedFiles;
//       }
  
//     } catch (error) {
//       console.error(error);
//       next(new ErrorResponse('Error submitting phase two!', 400));
//     }
//   });
  

// //SUPERVISOR/////////////////
// // @desc     get phase2 , same
// // @route    GET /api/
// // @access   Private

// exports.getStudentPhaseTwo = async (req, res, next) => {
//     try {
//       const { studentId } = req.params;
//       const { _id: supervisorId } = req.user;
  
//       // Find the student and phase two submission
//       const phaseTwo = await PhaseTwo.findOne({
//         student: studentId,
//         supervisor: supervisorId
//       }).populate('student', 'nom prenom email')
//         .populate('supervisor', 'nom prenom email');
        
  
//       // Check if phase two submission exists
//       if (!phaseTwo) {
//         return next(new ErrorResponse('Phase two submission not found!', 404));
//       }
  
//       res.status(200).json(phaseTwo);
//     } catch (error) {
//       console.error(error);
//       next(new ErrorResponse('Error getting phase two submission!', 400));
//     }
//   };
  

