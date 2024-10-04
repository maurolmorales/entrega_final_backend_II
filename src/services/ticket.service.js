import { ticket_DAO } from "../dao/ticket_dao.js";

export class TicketService {

  static createTicket = async (ticket) => {
    return await ticket_DAO.create(ticket);
  };

}
