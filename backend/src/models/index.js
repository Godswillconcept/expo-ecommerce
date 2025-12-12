import { sequelize } from '../config/database.js';
import User from './user.model.js';
import Address from './address.model.js';
import Wishlist from './wishlist.model.js';
import Product from './product.model.js';

const db = {
  User,
  Address,
  Wishlist,
  Product
};

// Initialize associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
