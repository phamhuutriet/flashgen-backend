import mongoose from "mongoose";
import flashcardModel from "../models/flashcard.model";
import deckModel from "../models/deck.model";
import { NotFoundErrorResponse } from "../core/error.response";
import { formatResult } from "./utils";

type FlashCard = {
  question: string;
  answer: string;
  tags: string[];
};

export const createNewFlashcardService = async (
  flashcard: FlashCard,
  deckId: mongoose.Types.ObjectId
) => {
  // Check if deck existed
  const foundDeck = await deckModel.findById(deckId);
  if (!foundDeck) throw new NotFoundErrorResponse("Deck not found");

  // Create flash card
  const newFlashCard = await flashcardModel.create({
    question: flashcard.question,
    answer: flashcard.answer,
    tags: flashcard.tags,
    deckId,
    dueDate: Date.now(),
  });

  // Add card to deck
  await foundDeck.updateOne({
    $addToSet: {
      flashCardsList: newFlashCard._id,
    },
  });

  return {
    code: "xxx",
    metadata: {
      flashcard: formatResult(
        ["_id", "question", "answer", "tags", "dueDate"],
        newFlashCard
      ),
    },
  };
};
