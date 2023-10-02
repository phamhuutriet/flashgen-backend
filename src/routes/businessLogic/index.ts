import express from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";
import {
  createDeck,
  createNewFlashcard,
  deleteFlashcard,
  getFlashcard,
  updateFlashcard,
} from "../../controllers/businessLogic.controller";

const businessLogicRouter = express.Router();

// AUTHENTICATION - have to pass this in order to access services
businessLogicRouter.use(authentication);

// BUSINESS LOGIC API

//Deck
businessLogicRouter.post("/deck/create", asyncHandler(createDeck));

// Flashcard
businessLogicRouter.post("/flashcard/create", asyncHandler(createNewFlashcard));
businessLogicRouter.get("/flashcard/get", asyncHandler(getFlashcard));
businessLogicRouter.patch("/flashcard/patch", asyncHandler(updateFlashcard));
businessLogicRouter.delete("/flashcard/delete", asyncHandler(deleteFlashcard));

export default businessLogicRouter;
