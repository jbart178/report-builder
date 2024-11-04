import { Freshservice } from "@freshworks/api-sdk";
import dotenv from "dotenv";

dotenv.config();

class FreshserviceHelper {
    /**
     * Constructor for FreshserviceHelper
     */
    constructor() {
        this.client = new Freshservice(
            process.env.FRESHSERVICE_DOMAIN,
            process.env.FRESHSERVICE_API_KEY
        );
    }

    /**
     * Get all tickets
     * @returns Array of tickets
     */
    async listTickets() {
        const tickets = await this.client.tickets.list();
        return tickets;
    }

    /**
     * Get a ticket by Id
     * @param {*} id - The id of the ticket to get
     * @returns Ticket
     */
    async getTicket(id) {
        const ticket = await this.client.tickets.get(id);
        return ticket;
    }

    /**
     * Get all tickets for a client for a given month
     * @param {*} client - The client to get tickets for
     * @param {*} month - The month to get tickets for
     * @returns Array of tickets
     */
    async getMonthlyTicketsByClient(client, month) {
        const tickets = await this.client.tickets.list({
            filters: {
                company: client,
                created_at: {
                    gte: `2024-${month}-01`,
                    lte: `2024-${month}-31`,
                },
            },
        });
        return tickets;
    }

    /**
     * Get the number of tickets received. Since we only intend on passing in a list of tickets that were recieved this month, we can just return the length of the list.
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Number of tickets received
     */
    getNumRecievedTickets(tickets) {
        return tickets.length;
    }

    /**
     * Get the number of resolved tickets, status 4 or 5
     * https://api.freshservice.com/#ticket_attributes
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Number of resolved or closed tickets
     */
    getNumResolvedTickets(tickets) {
        return tickets.filter((ticket) => ticket.status === 4 || ticket.status === 5).length;
    }

    /**
     * Get the number of open tickets, not closed
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Number of open tickets
     */
    getNumOpenTickets(tickets) {
        return tickets.filter((ticket) => !(ticket.status === 4 || ticket.status === 5)).length;
    }

    /**
     * Get the average response time for tickets
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Average response time
     */
    getAvgResponseTime(tickets) {
        const responseTime = tickets.map((ticket) => ticket.time_to_respond);
        return responseTime.reduce((a, b) => a + b, 0) / tickets.length;
    }

    /**
     * Get the average first response time for tickets
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Average first response time
     */
    getAvgFirstResponseTime(tickets) {
        const firstResponseTime = tickets.map((ticket) => ticket.time_to_first_response);
        return firstResponseTime.reduce((a, b) => a + b, 0) / tickets.length;
    }

    /**
     * Get the average resolution time for tickets
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Average resolution time
     */
    getAvgResolutionTime(tickets) {
        const resolutionTime = tickets.map((ticket) => ticket.time_to_resolve);
        return resolutionTime.reduce((a, b) => a + b, 0) / tickets.length;
    }

    /**
     * Get the average number of customer interactions per ticket
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Average number of customer interactions
     */
    getAvgCustomerInteractions(tickets) {
        const customerInteractions = tickets.map((ticket) => ticket.customer_interactions);
        return customerInteractions.reduce((a, b) => a + b, 0) / tickets.length;
    }

    /**
     * Get the average number of agent interactions per ticket
     * @param {*} tickets  - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Average number of agent interactions per ticket
     */
    getAvgAgentInteractions(tickets) {
        const agentInteractions = tickets.map((ticket) => ticket.agent_interactions);
        return agentInteractions.reduce((a, b) => a + b, 0) / tickets.length;
    }

    /**
     * Get the number of times tickets are reopened
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Number of times tickets are reopened
     */
    getNumberReopenedTickets(tickets) {
        return tickets.reduce((accumulator, current) => accumulator + current.reopened_count, 0);
    }

    /**
     * Get the number of times tickets are reassigned
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Number of times tickets are reassigned
     */
    getNumberReassignedTickets(tickets) {
        return tickets.reduce((accumulator, current) => accumulator + current.reassigned_count, 0);
    }

    /**
     * Get the percentage of tickets that have satisfied the SLA
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Percentage of tickets that have satisfied the SLA
     */
    getSLAPercentage(tickets) {
        return tickets.filter((ticket) => ticket.sla_satisfied).length / tickets.length;
    }

    /**
     * Get the percentage of tickets that have been resolved on the first contact
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Percentage of tickets that have been resolved on the first contact
     */
    getFCRPercentage(tickets) {
        return tickets.filter((ticket) => ticket.first_contact_resolution).length / tickets.length;
    }

    /**
     * Get the number of tickets by source
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Map of tickets by source
     */
    getTicketsBySource(tickets) {
        sourceMap = new Map();
        for (const ticket of tickets) {
            if (sourceMap.has(ticket.source)) {
                sourceMap.set(ticket.source, sourceMap.get(ticket.source) + 1);
            } else {
                sourceMap.set(ticket.source, 1);
            }
        }
        return sourceMap;
    }

    /**
     * Get the number of tickets by Type
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Map of tickets by Type
     */
    getTicketsByType(tickets) {
        typeMap = new Map();
        for (const ticket of tickets) {
            if (typeMap.has(ticket.type)) {
                typeMap.set(ticket.type, typeMap.get(ticket.type) + 1);
            } else {
                typeMap.set(ticket.type, 1);
            }
        }
        return typeMap;
    }

    /**
     * Get the number of tickets by priority
     * @param {*} tickets - Array of tickets, or result of this.getMonthlyTicketsByClient
     * @returns Map of tickets by priority
     */
    getTicketsByPriority(tickets) {
        priorityMap = new Map();
        for (const ticket of tickets) {
            if (priorityMap.has(ticket.priority)) {
                priorityMap.set(ticket.priority, priorityMap.get(ticket.priority) + 1);
            } else {
                priorityMap.set(ticket.priority, 1);
            }
        }
        return priorityMap;
    }
}

export default FreshserviceHelper;
