import db from '../models';

export const getNumber = async (identnumber) => {
  db.sequelize.sync();

  const User = db.User;
  const Record = db.Record;
  const user = await User.findOne({
    where: { identnumber: identnumber },
  });
  if (user) {
    const userRelatedRecords = await Record.findAll({
      where: { identnumber },
      order: [['number', 'DESC']],
    });
    if (userRelatedRecords && userRelatedRecords.length > 0) {
      return userRelatedRecords[0].number + 1;
    } else {
      return 1;
    }
  } else {
    return -1;
  }
};
