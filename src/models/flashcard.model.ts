import mongoose from "mongoose";

const DOCUMENT_NAME = "FlashCard";
const COLLECTION_NAME = "FlashCard";

// Declare the Schema of the Mongo model
var flashCardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    deckIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, flashCardSchema);
