import mongoose, { Types } from "mongoose";
import { RequestHandler } from "express";
import { CreatedResponse, OKResponse } from "../core/success.response";
import {
  createDeckService,
  getDeckService,
  updateDeckService,
} from "../services/deck.service";

export const createDeck: RequestHandler = async (req, res, next) => {
  return new CreatedResponse({
    message: "Created deck successfully",
    metadata: await createDeckService(req.body),
  }).send(res);
};

export const getDeck: RequestHandler = async (req, res, next) => {
  return new OKResponse({
    message: "Get deck successfully",
    metadata: await getDeckService(
      new Types.ObjectId(req.query.deckId as string)
    ),
  }).send(res);
};

export const updateDeck: RequestHandler = async (req, res, next) => {
  const deck = req.body;
  deck.id = new mongoose.Types.ObjectId(deck.id);

  return new OKResponse({
    message: "Updated deck successfully",
    metadata: await updateDeckService(deck),
  }).send(res);
};
