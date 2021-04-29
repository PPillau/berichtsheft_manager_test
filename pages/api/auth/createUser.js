// pages/api/user.js
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import db from '../../../models';
db.sequelize.sync();
const User = db.User;

export default async (req, res) => {
  console.log(req.body);

  // console.log(req.body)
  // Recieved params from request
  let {
    identnumber,
    firstname,
    surname,
    password,
    salt,
    email,
    dateofbirth,
    street,
    zipcode,
    beginofapprenticeship,
    apprenticeshipyear,
  } = req.body;

  try {
    // check email, name, password format
    // if (!isEmail(email)) {
    //   return res.status(422).send('Email must be valid');
    // }

    // // Check if user with that email if already exists
    // const user = await User.findOne({
    //   where: { email: email },
    // });
    // if (user) {
    //   return res.status(422).send(`User already exist with that ${email}`);
    // }
    const newUser = await User.create({
      identnumber,
      firstname,
      surname,
      password,
      salt,
      email,
      dateofbirth: new Date(dateofbirth),
      street,
      zipcode,
      beginofapprenticeship: new Date(beginofapprenticeship),
      apprenticeshipyear,
    });
    res.status(201).send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in signup. Please try again.');
  }
};
