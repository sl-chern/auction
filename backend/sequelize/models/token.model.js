import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('token', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		refresh_token: {
			allowNull: false,
			type: DataTypes.UUID
		},
        device_id: {
			allowNull: false,
			type: DataTypes.UUID
		},
	});
};