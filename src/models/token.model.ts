import mongoose from "mongoose";

const DOCUMENT_NAME = "Tokens";
const COLLECTION_NAME = "Tokens";

// Declare the Schema of the Mongo model
var tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    publicKey: {
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
export default mongoose.model(DOCUMENT_NAME, tokenSchema);
