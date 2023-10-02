import mongoose from "mongoose";
import flashcardModel from "../models/flashcard.model";
import deckModel from "../models/deck.model";
import { NotFoundErrorResponse } from "../core/error.response";
import { formatResult } from "./utils";

export type FlashCard = {
  id?: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  tags: string[];
  dueDate?: Date;
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

export const getFlashcardService = async (
  flashcardId: mongoose.Types.ObjectId
) => {
  const flashcard = await flashcardModel.findById(flashcardId);
  if (!flashcard) throw new NotFoundErrorResponse("Flashcard not found!");

  return flashcard;
};

export const updateFlashcardService = async (flashcard: FlashCard) => {
  const foundFlashcard = await flashcardModel.findById(flashcard.id);
  if (!foundFlashcard) throw new NotFoundErrorResponse("Flashcard not found!");

  return await foundFlashcard.updateOne({
    $set: {
      question: flashcard.question,
      answer: flashcard.answer,
      tags: flashcard.tags,
      dueDate: flashcard.dueDate,
    },
  });
};

export const deleteFlashcardService = async (
  flashcardId: mongoose.Types.ObjectId
) => {
  const foundFlashcard = await flashcardModel.findById(flashcardId);
  if (!foundFlashcard) throw new NotFoundErrorResponse("Flashcard not found!");

  return await foundFlashcard.deleteOne();
};
