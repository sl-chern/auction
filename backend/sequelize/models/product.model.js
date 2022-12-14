import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('product', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING
		},
		cur_price: {
			allowNull: false,
			type: DataTypes.DOUBLE(16,2)
		},
		description: {
			allowNull: false,
			type: DataTypes.TEXT
		},
		image: {
			allowNull: false,
			type: DataTypes.TEXT
		},
		location: {
			allowNull: false,
			type: DataTypes.STRING
		},
		start_date: {
			allowNull: false,
			type: DataTypes.DATE
		},
		end_date: {
			allowNull: false,
			type: DataTypes.DATE
		},
	});
};