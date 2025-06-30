const EventRepo = require('../repos/EventRepo');
const BaseController = require('./BaseController');

class EventController extends BaseController {
  constructor() {
    super();
    this.eventRepo = new EventRepo();
  }

  async getActiveEvents(req, res) {
    const events = await this.eventRepo.getActiveEvents();
    return this.sendResponse(res, 200, 'Events retrieved successfully', events);
  }

  async getUpcomingEvents(req, res) {
    const limit = req.query.limit || 10;
    const events = await this.eventRepo.getUpcomingEvents(limit);
    return this.sendResponse(res, 200, 'Upcoming events retrieved successfully', events);
  }

  async getEventsByCategory(req, res) {
    const { category } = req.params;
    const events = await this.eventRepo.getEventsByCategory(category);
    return this.sendResponse(res, 200, `Events in ${category} category retrieved successfully`, events);
  }

  async getEventById(req, res) {
    const { id } = req.params;
    const event = await this.eventRepo.getActiveEventById(id);

    if (!event) {
      return this.sendErrorResponse(res, 404, 'Event not found');
    }
    
    return this.sendResponse(res, 200, 'Event retrieved successfully', event);
  }

  async getEventsByType(req, res) {
    const { type } = req.params;
    const events = await this.eventRepo.getEventsByType(type);
    return this.sendResponse(res, 200, `${type} events retrieved successfully`, events);
  }

  async getEventsByConsultationType(req, res) {
    const { consultationType } = req.params;
    const events = await this.eventRepo.getEventsByConsultationType(consultationType);
    return this.sendResponse(res, 200, `${consultationType} events retrieved successfully`, events);
  }

  async getEventsByDateRange(req, res) {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return this.sendErrorResponse(res, 400, 'Start date and end date are required');
    }

    const events = await this.eventRepo.getEventsByDateRange(new Date(startDate), new Date(endDate));
    return this.sendResponse(res, 200, 'Events in date range retrieved successfully', events);
  }

  async searchEventsByTags(req, res) {
    const { tags } = req.query;
      
    if (!tags) {
      return this.sendErrorResponse(res, 400, 'Tags parameter is required');
    }

    const tagArray = Array.isArray(tags) ? tags : tags.split(',');
    const events = await this.eventRepo.searchEventsByTags(tagArray);
    return this.sendResponse(res, 200, 'Events with specified tags retrieved successfully', events);
  }

  async getPastEvents(req, res) {
    const limit = req.query.limit || 10;
    const events = await this.eventRepo.getPastEvents(limit);
    return this.sendResponse(res, 200, 'Past events retrieved successfully', events);
  }

  async getEventsWithPagination(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};
    
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.eventType) {
      filters.eventType = req.query.eventType;
    }
    if (req.query.consultationType) {
      filters.consultationType = req.query.consultationType;
    }

    const result = await this.eventRepo.getEventsWithPagination(page, limit, filters);
    
    return this.sendResponse(res, 200, 'Events retrieved successfully', {
      events: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit)
      }
    });
  }

  async createEvent(req, res) {
    const eventData = req.body;
    const event = await this.eventRepo.create(eventData);
    return this.sendResponse(res, 201, 'Event created successfully', event);
  }

  async updateEvent(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await this.eventRepo.update(id, updateData);

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Event not found');
    }

    const updatedEvent = await this.eventRepo.findById(id);
    return this.sendResponse(res, 200, 'Event updated successfully', updatedEvent);
  }

  async updateEventStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return this.sendErrorResponse(res, 400, 'Status is required');
    }

    const [updatedRowsCount] = await this.eventRepo.updateEventStatus(id, status);

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Event not found');
    }

    return this.sendResponse(res, 200, 'Event status updated successfully');
  }

  async deleteEvent(req, res) {
    const { id } = req.params;
    
    const [updatedRowsCount] = await this.eventRepo.softDelete(id);

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Event not found');
    }

    return this.sendResponse(res, 200, 'Event deleted successfully');
  }
}

module.exports = EventController;
