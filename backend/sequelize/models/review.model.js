import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('review', {
		text: {
			allowNull: false,
			type: DataTypes.TEXT
		},
        mark: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
		seller_id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		buyer_id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER
		}
	});
};