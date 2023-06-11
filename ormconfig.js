module.exports = {
  type: 'mysql',
  host: 'rca-parsimonia-server.mysql.database.azure.com',
  port: 3306,
  username: 'rca123parsimonia',
  password: 'edco-password1',
  database: 'rca-db',
  autoLoadEntities: true,
  synchronize: true,
  ssl: true,
  migrationsRun: true,
  logging: false,
  //timezone: '+0',
  bigNumberStrings: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [
    process.env.ENVIRONMENT == 'prod'
      ? '**/domain/entities/*.js'
      : 'dist/**/domain/entities/*.js',
  ],
};
