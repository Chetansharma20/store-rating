const Store = require('../models/StoreSchema.js');
const Rating = require('../models/RatingSchema.js');
const User = require('../models/userSchema.js');
const { fn, col, Op } = require('sequelize');
const AppError = require('../utils/appError.js');

exports.createStore = async ({ name, email, address, owner_id }) => {
  if (!name || !email || !address || !owner_id) {
    throw new AppError("Store name, email, address, and owner_id are required.", 400);
  }

  const newStore = await Store.create({
    name,
    email,
    address,
    owner_id,
  });
  return newStore;
};


exports.getAllStoresWithRatingsFiltered = async ({ name, address, email, search }) => {
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  } else {
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
  }

  const stores = await Store.findAll({
    where,
    include: [
      {
        model: Rating,
        as: 'ratings',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      }
    ],
    attributes: {
      include: [
        [
          fn('AVG', col('ratings.value')),
          'average_rating'
        ]
      ]
    },
    group: ['Store.id', 'ratings.id', 'ratings->user.id']
  });

  return stores;
};

exports.getRatingsForMyStore = async (ownerId) => {
  if (!ownerId) {
    throw new AppError("Owner ID not found in session.", 401);
  }

  const stores = await Store.findAll({
    where: { owner_id: ownerId },
    include: [
      {
        model: Rating,
        as: 'ratings',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      }
    ],
    attributes: {
      include: [
        [
          fn('AVG', col('ratings.value')),
          'average_rating'
        ]
      ]
    },
    group: ['Store.id', 'ratings.id', 'ratings->user.id']
  });

  if (!stores.length) {
    throw new AppError("No stores found for this owner.", 404);
  }

  return stores.map(store => {
    const storeJSON = store.toJSON();
    return {
      store: storeJSON.name,
      store_id: storeJSON.id,
      email: storeJSON.email,
      address: storeJSON.address,
      average_rating: parseFloat(storeJSON.average_rating || 0),
      ratings: storeJSON.ratings || []
    };
  });
};
