import { Types } from "mongoose";
import deckModel from "../models/deck.model";
import { NotFoundErrorResponse } from "../core/error.response";
import flashcardModel from "../models/flashcard.model";

type Deck = {
  id?: Types.ObjectId;
  name: string;
  flashCardList: Types.ObjectId[];
  isPublic: Boolean;
  tags: string[];
};

export const createDeckService = async (deck: Deck) => {
  return await deckModel.create({
    flashCardsList: deck.flashCardList,
    isPublic: deck.isPublic,
  });
};

export const getDeckService = async (deckId: Types.ObjectId) => {
  const foundDeck = await deckModel.findById(deckId);
  if (!foundDeck) throw new NotFoundErrorResponse("Deck not found!");

  return foundDeck;
};

export const updateDeckService = async (deck: Deck) => {
  const foundDeck = await deckModel.findById(deck.id);
  if (!foundDeck) throw new NotFoundErrorResponse("Deck not found!");

  return await foundDeck.updateOne({
    $set: {
      name: deck.name,
      isPublic: deck.isPublic,
      tags: deck.tags,
    },
  });
};

export const deleteDeckService = async (deckId: Types.ObjectId) => {
  const foundDeck = await deckModel.findById(deckId);
  if (!foundDeck) throw new NotFoundErrorResponse("Deck not found!");

  // Remove this deckId from all flashcard that belongs to it
  foundDeck.flashCardsList.forEach(async (flashCardId: Types.ObjectId) => {
    const foundFlashCard = await flashcardModel.findById(flashCardId);
    await foundFlashCard?.updateOne({
      $pull: {
        deckIds: deckId,
      },
    });
  });

  return await foundDeck.deleteOne();
};

/**
 *
 * @param deck
 * @param flashCard
 * This method add existed flashcard to existed deck
 * @returns
 */
export const addCardToDeckService = async (
  deck: Deck,
  flashCardId: Types.ObjectId
) => {
  const foundDeck = await deckModel.findById(deck.id);
  if (!foundDeck) throw new NotFoundErrorResponse("Deck not found!");

  const foundFlashcard = await flashcardModel.findById(flashCardId);
  if (!foundFlashcard) throw new NotFoundErrorResponse("Flashcard not found!");

  const updatedFlashcard = await foundFlashcard.updateOne({
    $addToSet: {
      deckIds: foundDeck._id,
    },
  });

  const updatedDeck = await foundDeck.updateOne({
    $addToSet: {
      flashCardsList: flashCardId,
    },
  });

  return {
    updatedFlashcard,
    updatedDeck,
  };
};
