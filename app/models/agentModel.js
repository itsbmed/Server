"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Agent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        checkPassword(passWord) {
            return this.passWord === passWord;
        }
    }
    Agent.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            userName: DataTypes.STRING,
            passWord: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Agent",
        }
    );
    return Agent;
};