import { DataTypes } from 'sequelize'

export default (sequelize) => {
	sequelize.define('review', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		text: {
			allowNull: false,
			type: DataTypes.TEXT
		},
        mark: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }
	});
};