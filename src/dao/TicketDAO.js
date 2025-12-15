import ticketModel from "../models/ticketModel.js";

class TicketDAO {
  async create(ticketData) {
    return await ticketModel.create(ticketData);
  }

  async findByCode(code) {
    return await ticketModel.findOne({ code });
  }

  async findByPurchaser(purchaserId) {
    return await ticketModel.find({ purchaser: purchaserId });
  }

  async findAll() {
    return await ticketModel.find();
  }

  async updateStatus(code, status) {
    return await ticketModel.findOneAndUpdate(
      { code },
      { status },
      { new: true }
    );
  }
}

export default new TicketDAO();
