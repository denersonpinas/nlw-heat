import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { getLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

export const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle)

router.post("/messages", ensureAuthenticated, new CreateMessageController().handle);

router.get("/messages/last3", new getLast3MessagesController().handle)

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);