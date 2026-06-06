const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fee_receipt', {
    receipt_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    txn_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_size_kb: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'fee_receipt',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "receipt_id" },
        ]
      },
      {
        name: "txn_id",
        using: "BTREE",
        fields: [
          { name: "txn_id" },
        ]
      },
    ]
  });
};
