import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('user', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
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
        email: {
			allowNull: false,
			type: DataTypes.STRING
		},
        password: {
			allowNull: true,
			type: DataTypes.STRING
		},
        image: {
			allowNull: false,
			type: DataTypes.TEXT
		},
	});
};