const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async (request,response,next) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', '');
    //decoded is the payload of the token if signature is correct
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //_id of token is set to be same as _id of user on creation
    //'tokens.token' string property syntax is for searching through the tokens array and comparing each token object to a value
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
    if (!user) {
      throw new Error();
    }
    //Access to current token is to be added to requests so that on logout, only current token is deleted
    request.token = token;
    //Simply return user so following middleware functions do not waste resources
    request.user = user;
    next();
  } catch (e) {
    response.status(401).send({error: 'Please authenticate'});
  }
}

module.exports = auth;