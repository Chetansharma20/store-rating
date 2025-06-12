const Rating = require('../models/RatingSchema.js');
const User = require('../models/userSchema.js');


exports.createOrUpdateRating = async (req, res) => {
  try {
    const { user_id, store_id, value } = req.body;

    if (!user_id || !store_id || value === undefined) {
      return res.status(400).json({ error: "user_id, store_id, and value are required." });
    }

    const [rating, created] = await Rating.upsert(
      { user_id, store_id, value },
      { returning: true }
    );

    const updatedRating = await Rating.findOne({ where: { user_id, store_id } });

    res.status(created ? 201 : 200).json(updatedRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRatingsForStore = async (req, res) => {
  try {
    const storeId = req.query.storeId;

    if (!storeId) {
      return res.status(400).json({ error: 'storeId is required as a query parameter.' });
    }

    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAverageRatingForStore = async (req, res) => {
  try {
    const storeId = req.query.storeId;

    if (!storeId) {
      return res.status(400).json({ error: 'storeId is required as a query parameter.' });
    }

    const result = await Rating.findOne({
      where: { store_id: storeId },
      attributes: [
        [Rating.sequelize.fn('AVG', Rating.sequelize.col('value')), 'avg_rating']
      ]
    });

    res.json({ average: parseFloat(result.get('avg_rating')) || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
