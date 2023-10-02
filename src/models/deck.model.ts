import mongoose from "mongoose";

const DOCUMENT_NAME = "Deck";
const COLLECTION_NAME = "Deck";

// Declare the Schema of the Mongo model
var deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    flashCardsList: {
      type: Array,
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: {
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
export default mongoose.model(DOCUMENT_NAME, deckSchema);
