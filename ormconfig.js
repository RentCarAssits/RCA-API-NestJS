module.exports = {
  type: 'mysql',
  url: process.env.RCA_DB_MYSQL,
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'rca-db',
  autoLoadEntities: true,
  synchronize: true,
  ssl: true,
  migrationsRun: true,
  logging: false,
  bigNumberStrings: false,
  entities: [
    process.env.ENVIRONMENT == 'prod'
      ? '*/domain/entities/.js'
      : 'dist/*/domain/entities/.js',
  ],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};