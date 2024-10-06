export class Ticket_DTO {
  constructor(ticket) {
    this.code = String(ticket.code);
    this.amount = Number(ticket.amount);
    this.purchaser = String(ticket.purchaser);
    this.details = Array.isArray(ticket.details) ? ticket.details : [];
  }
}
