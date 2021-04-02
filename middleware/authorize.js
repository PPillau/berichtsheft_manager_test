import Axios from 'axios';

const authorize = async (req, res, next) => {
  if (req.headers.authorization) {
    Axios.post(
      'http://localhost:3000/api/auth/verify',
      { token: req.headers.authorization.split(' ')[1] },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((verfifyResponse) => {
        if (verfifyResponse.status == 200) {
          next();
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(403).json({ error: 'Unauthorized access!' });
      });
  } else {
    res.status(403).json({ error: 'Unauthorized access!' });
  }
};

export default authorize;
