import { Types } from "mongoose";
import deckModel from "../models/deck.model";
import { NotFoundErrorResponse } from "../core/error.response";

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
