const Store = require('../models/StoreSchema.js');


exports.createStore = async (req, res) => {
  try {
    const { name,email, address, owner_id } = req.body;

    const newStore = await Store.create({
      name,
      email,
      address,
    owner_id, 
    });

    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStoreById = async (req, res) => {
  try {
    const storeId = req.query.id;
    if (!storeId) return res.status(400).json({ error: 'Please provide store ID in query' });

    const store = await Store.findByPk(storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getStoresByOwnerId = async (req, res) => {
  try {
    const { owner_id } = req.query;

    if (!owner_id) {
      return res.status(400).json({ error: 'Please provide owner_id in query' });
    }

    const stores = await Store.findAll({
      where: { owner_id }
    });

    if (!stores || stores.length === 0) {
      return res.status(404).json({ error: 'No stores found for this owner' });
    }

    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
