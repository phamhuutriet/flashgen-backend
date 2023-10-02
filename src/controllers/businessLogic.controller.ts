import { RequestHandler } from "express";
import { CreatedResponse, OKResponse } from "../core/success.response";
import { createDeckService } from "../services/deck.service";
import {
  createNewFlashcardService,
  deleteFlashcardService,
  getFlashcardService,
  updateFlashcardService,
} from "../services/flashcard.service";
import mongoose from "mongoose";

export const createDeck: RequestHandler = async (req, res, next) => {
  return new CreatedResponse({
    message: "Created deck successfully",
    metadata: await createDeckService(req.body),
  }).send(res);
};

export const createNewFlashcard: RequestHandler = async (req, res, next) => {
  return new CreatedResponse({
    message: "Created new flashcard successfully",
    metadata: await createNewFlashcardService(
      req.body.flashcard,
      new mongoose.Types.ObjectId(req.body.deckId)
    ),
  }).send(res);
};

export const getFlashcard: RequestHandler = async (req, res, next) => {
  return new OKResponse({
    message: "Get flashcard successfully",
    metadata: await getFlashcardService(
      new mongoose.Types.ObjectId(req.query.flashcardId as string)
    ),
  }).send(res);
};

export const updateFlashcard: RequestHandler = async (req, res, next) => {
  const flashcard = req.body.flashcard;
  flashcard.id = new mongoose.Types.ObjectId(flashcard.id);

  return new OKResponse({
    message: "Update flashcard successfully",
    metadata: await updateFlashcardService(flashcard),
  }).send(res);
};

export const deleteFlashcard: RequestHandler = async (req, res, next) => {
  return new OKResponse({
    message: "Delete flashcard successfully",
    metadata: await deleteFlashcardService(
      new mongoose.Types.ObjectId(req.query.flashcardId as string)
    ),
  }).send(res);
};
