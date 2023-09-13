const dev = {
  db: {
    host: process.env.DEV_HOST || "127.0.0.1",
    name: process.env.DEV_NAME || "flashgenBackendMongoDB",
    port: process.env.DEV_PORT || 27018,
  },
};

const prod = {
  db: {
    host: process.env.PROD_HOST || "127.0.0.1",
    name: process.env.PROD_NAME || "flashgenBackendMongoDB",
    port: process.env.PROD_PORT || 27019,
  },
};

interface Config {
  dev: any;
  prod: any;
}

const config: Config = { dev, prod };
const env: keyof Config = (process.env.NODE_ENV || "dev") as keyof Config;

export default config[env];
