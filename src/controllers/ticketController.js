import TicketRepository from "../repositories/TicketRepository.js";
import TicketService from "../services/ticketService.js";

class TicketController {
  async getUserTickets(req, res) {
    try {
      const tickets = await TicketService.getPurchaseHistory(req.user.id);
      res.json({
        status: "success",
        payload: tickets,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllTickets(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: "error",
          message: "Only admin can view all tickets",
        });
      }

      const tickets = await TicketRepository.getAllTickets();
      res.json({
        status: "success",
        payload: tickets,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getTicketByCode(req, res) {
    try {
      const { code } = req.params;
      const ticket = await TicketRepository.getTicketByCode(code);

      if (!ticket) {
        return res.status(404).json({
          status: "error",
          message: "Ticket not found",
        });
      }

      if (req.user.role !== "admin" && ticket.purchaser !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "You can only view your own tickets",
        });
      }

      res.json({
        status: "success",
        payload: ticket,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new TicketController();
