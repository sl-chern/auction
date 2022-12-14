import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('order', {
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
        first_name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		last_name: {
			allowNull: false,
			type: DataTypes.STRING
		},
        phone: {
			allowNull: false,
			type: DataTypes.STRING(13)
		},
	});
};