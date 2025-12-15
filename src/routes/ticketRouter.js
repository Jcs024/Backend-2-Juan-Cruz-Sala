import { Router } from "express";
import TicketController from "../controllers/ticketController.js";
import { authMiddleware, isUser } from "../middlewares/authorization.js";

const router = Router();

router.use(authMiddleware("jwt"));

router.get("/my-tickets", isUser, TicketController.getUserTickets);

router.get("/", TicketController.getAllTickets);

router.get("/:code", TicketController.getTicketByCode);

export default router;
