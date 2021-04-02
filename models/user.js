// model/user.js
const userModel = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      identnumber: {
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        trim: true,
      },
      dateofbirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zipcode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      beginofapprenticeship: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      apprenticeshipyear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};

export default userModel;
