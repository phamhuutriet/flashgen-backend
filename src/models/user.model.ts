import mongoose from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "User";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, userSchema);
