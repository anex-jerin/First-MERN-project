const User = require('../model/User');
const Note = require('../model/Note');
//handles the error (no need for try catch)
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// Get all users
// route GET /users
// private
const getAllUsers = asyncHandler(async (req, res) => {
  //select- do not return password, lean() - gives plain javascript object (not mongoose object, faster this way)
  const users = await User.find().select('-password').lean();
  !users
    ? res.status(400).json({ message: 'No users found' })
    : res.json(users);
});

// Create new user
// route POST /users
// private
const creatUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // exec() - will return a promise
  const duplicate = await User.find({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Username not available' });
  }
  //hashed password
  const hashedPassword = await bcrypt.hash(password, 10); // salt rounds
  const userObject = { username, password: hashedPassword, roles };
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid user data recived' });
  }
});

// Update user
// route PATCH /users
// private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: 'user not found' });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res
      .status(409)
      .json({ message: 'Duplicate username try another one' });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

// Delete user
// route DELETE /users
// private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if(!id){
    return res.status(400).json({message:'user ID required'})
  }
  const notes = await Note.findOne({user:id}).lean().exec()
  //optional chaining
  if(notes?.length ){
    return res.status(400).json({message:`User has assigned notes`})
  }
  const user = await User.findById(id).exec()

  if(!user){
    return res.status(400).json({message:'User not found'})
  }
  const result = await User.deleteOne()
  const reply = `Username ${result.username} with ID ${_id}`
  res.json(reply)
});

module.exports = {
  getAllUsers,
  creatUser,
  updateUser,
  deleteUser,
};
