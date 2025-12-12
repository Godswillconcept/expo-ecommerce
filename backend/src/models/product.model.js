import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  images: {
    type: DataTypes.JSON, // Using JSON for multiple images
    defaultValue: [],
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'products',
  timestamps: true,
});

// Associations can be defined here or in index.js
Product.associate = (models) => {
  // Relationship with Wishlist
  Product.hasMany(models.Wishlist, {
    foreignKey: 'productId',
    as: 'wishlistedBy',
  });
};

export default Product;
