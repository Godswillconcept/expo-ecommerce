import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clerkId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users', // Explicitly set the table name
  timestamps: true,   // Automatically add createdAt and updatedAt
});

// Relationships
User.associate = (models) => {
  // A user can have many addresses
  User.hasMany(models.Address, {
    foreignKey: 'userId',
    as: 'addresses',
    onDelete: 'CASCADE'
  });

  // A user can have many wishlist items
  User.hasMany(models.Wishlist, {
    foreignKey: 'userId',
    as: 'wishlistItems',
    onDelete: 'CASCADE'
  });
};

export default User;
