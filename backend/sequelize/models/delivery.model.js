import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('delivery', {
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
        city: {
			allowNull: false,
			type: DataTypes.STRING
		},
        post_office: {
            allowNull: false,
			type: DataTypes.INTEGER
        }
	});
};