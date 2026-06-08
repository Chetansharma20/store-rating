const User = require('../models/userSchema.js');
const Store = require('../models/StoreSchema.js');
const Rating = require('../models/RatingSchema.js');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const AppError = require('../utils/appError.js');

const { validateUserFields } = require('../utils/validationHelper.js'); 


exports.createUser = async ({ name, email, address, password, role }) => {
  validateUserFields({ name, email, password, address }); 


  // Check unique email
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError("Email already exists", 400);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, password_hash, role });
  return user;
};

exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email", 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new AppError("Invalid password", 401);
  }


  const token = generateToken(user);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    },
    role: user.role,
  };
};

exports.getAllUsersFiltered = async ({
  name,
  email,
  address,
  role,
  search
}) => {
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  } else {
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
  }

  if (role) {
    where.role = role;
  }

  const users = await User.findAll({
    where,
    include: [
      {
        model: Store,
        as: 'stores',
        include: [
          {
            model: Rating,
            as: 'ratings',
            attributes: ['value']
          }
        ]
      }
    ]
  });

  return users.map(user => {
    const userJSON = user.toJSON();

    if (userJSON.role !== 'store_owner') {
      return userJSON;
    }

    if (!userJSON.stores?.length) {
      userJSON.rating = 'No stores';
      return userJSON;
    }

    const ratings = userJSON.stores.flatMap(
      store => store.ratings || []
    );

    if (!ratings.length) {
      userJSON.rating = 'No ratings';
      return userJSON;
    }

    const averageRating =
      ratings.reduce((sum, rating) => sum + rating.value, 0) /
      ratings.length;

    userJSON.rating = averageRating.toFixed(2);

    return userJSON;
  });
};



exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
  validateUserFields({ password: newPassword }); 


  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const match = await bcrypt.compare(oldPassword, user.password_hash);
  if (!match) {
    throw new AppError("Old password incorrect", 401);
  }

  user.password_hash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password updated successfully" };
};
