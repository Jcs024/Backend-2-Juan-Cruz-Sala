import TicketDAO from "../dao/TicketDAO.js";
import TicketDTO from "../dtos/TicketDTO.js";

class TicketRepository {
  async createTicket(ticketData) {
    const ticket = await TicketDAO.create(ticketData);
    return TicketDTO.fromTicket(ticket);
  }

  async getTicketByCode(code) {
    const ticket = await TicketDAO.findByCode(code);
    return ticket ? TicketDTO.fromTicket(ticket) : null;
  }

  async getTicketsByPurchaser(userId) {
    const tickets = await TicketDAO.findByPurchaser(userId);
    return TicketDTO.fromTickets(tickets);
  }

  async getAllTickets() {
    const tickets = await TicketDAO.findAll();
    return TicketDTO.fromTickets(tickets);
  }

  async updateTicketStatus(code, status) {
    const ticket = await TicketDAO.updateStatus(code, status);
    return ticket ? TicketDTO.fromTicket(ticket) : null;
  }
}

export default new TicketRepository();
