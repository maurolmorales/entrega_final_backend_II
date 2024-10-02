import ticketSchema from "./models/ticket.model.js";

export class ticket_DAO {

  static create = async (ticket) => {
    try {
      return await ticketSchema.create(ticket);
    } catch (error) {
      throw new Error("Error generate Ticket: " + error.message);
    }
  };

}
