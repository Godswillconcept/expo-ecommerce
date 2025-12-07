import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // This references the 'users' table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  }, 
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'United States',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'addresses',
  timestamps: true,
});

// Relationships
Address.associate = (models) => {
  // An address belongs to a user
  Address.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
};

export default Address;
