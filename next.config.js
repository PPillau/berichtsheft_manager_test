module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    db: {
      host: 'localhost',
      user: 'berichtsheft_manager',
      password: '123456',
      database: 'berichtsheft_manager',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
    secret: 'jdaskjadfslkjfdsa',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
  sassOptions: {
    includePaths: ['./styles', './components'],
  },
};
