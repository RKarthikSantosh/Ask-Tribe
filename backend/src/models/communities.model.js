const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const CommunitiesModel = db.define('communities', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: 'name',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  db,
  tableName: 'communities',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id' },
      ],
    },
    {
      name: 'name',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'name' },
      ],
    },
  ],
});

module.exports = { CommunitiesModel };
