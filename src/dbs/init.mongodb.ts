import mongoose from "mongoose";

const HOST = "127.0.0.1";
const NAME = "flashgenBackendMongoDB";
const PORT = 27018;
const mongoURL = `mongodb://${HOST}:${PORT}/${NAME}`;

console.log(`Connect string: ${mongoURL}`);

class Database {
  static instance: Database | undefined;

  constructor() {
    this.connect();
  }

  async connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(mongoURL)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => console.error(`Error connecting to mongoDB: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const mongoDBInstance = Database.getInstance();

export default mongoDBInstance;
