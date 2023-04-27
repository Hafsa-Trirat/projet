/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization failed: Token missing' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, 'secret_key');
console.log("hello")
    // Add the user ID from the token to the request object
    req.user = decoded.user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    console.log(token)
    return res.status(401).json({ message: 'Authorization failed: Invalid token' });

  }
};
*/
/*
 
    function authRole(role) {
      return (req, res, next) => {


        if (req.user.role !== role) {
          res.status(401)
          return res.send('Not allowed')
        }
    
        next()
      }
    }*/


//module.exports = {authMiddleware,authRole};
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization failed: Token missing' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, 'secret_key');

    // Add the user ID from the token to the request object
    req.user = decoded.user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Authorization failed: Invalid token' });
  }
};
module.exports = authMiddleware;