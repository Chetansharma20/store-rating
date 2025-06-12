const Store = require('../models/StoreSchema.js');
const Rating = require('../models/RatingSchema.js');
const User = require('../models/userSchema.js');
const { fn, col } = require('sequelize');


exports.getRatingsForMyStore = async (req, res) => {
  try {
    const { owner_id } = req.body;

    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required in request body.' });
    }

    const stores = await Store.findAll({ where: { owner_id } });

    if (!stores.length) {
      return res.status(404).json({ error: 'No stores found for this owner.' });
    }

    const results = [];

    for (const store of stores) {
      const ratings = await Rating.findAll({
        where: { store_id: store.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      const avg = await Rating.findOne({
        where: { store_id: store.id },
        attributes: [[fn('AVG', col('value')), 'avg_rating']],
      });

      results.push({
        store: store.name,
        store_id: store.id,
        email:store.email,
        address:store.address,
        average_rating: parseFloat(avg?.get('avg_rating')) || 0,
        ratings,
      });
    }

    res.json(results);

  } catch (err) {
    console.error('Error fetching store ratings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllStoresWithRatings = async (req, res) => {
  try {
    const stores = await Store.findAll({
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
            // Calculate average rating
            fn('AVG', col('ratings.value')),
            'average_rating'
          ]
        ]
      },
      group: ['Store.id', 'ratings.id', 'ratings->user.id']
    });

    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores with ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};