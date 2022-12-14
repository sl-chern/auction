import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('bet', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		price: {
			allowNull: false,
			type: DataTypes.DOUBLE(16,2)
		},
        date: {
			allowNull: false,
			type: DataTypes.DATE
		},
	});
};