import mongoose from "mongoose";
import deckModel from "../models/deck.model";

type Deck = {
  flashCardList: mongoose.Schema.Types.ObjectId[];
  isPublic: Boolean;
};

export const createDeckService = async (deck: Deck) => {
  return await deckModel.create({
    flashCardsList: deck.flashCardList,
    isPublic: deck.isPublic,
  });
};
