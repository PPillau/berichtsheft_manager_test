const recordModel = (sequelize, Sequelize) => {
  const record = sequelize.define(
    'records',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      number: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      identnumber: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      beginOfWeek: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endOfWeek: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      apprenticeshipyear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      statusText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return record;
};

export default recordModel;
