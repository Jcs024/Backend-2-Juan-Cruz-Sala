class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.products = ticket.products;
    this.status = ticket.status;
  }

  static fromTicket(ticket) {
    return new TicketDTO(ticket);
  }

  static fromTickets(tickets) {
    return tickets.map((ticket) => new TicketDTO(ticket));
  }
}

export default TicketDTO;
