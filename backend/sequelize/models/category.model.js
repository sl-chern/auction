import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('category', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING
		}
	});
};