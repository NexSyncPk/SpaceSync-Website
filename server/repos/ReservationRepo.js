const BaseRepo = require('./BaseRepo');
const { Event } = require('../models');

class EventRepo extends BaseRepo {
  constructor() {
    super(Event);
  }

  async getActiveEvents() {
    return await this.model.findAll({
      where: { 
        isActive: true,
        status: 'published' 
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async getUpcomingEvents(limit = 10) {
    const { Op } = require('sequelize');
    const currentDate = new Date();
    
    return await this.model.findAll({
      where: { 
        isActive: true,
        status: 'published',
        startDateTime: {
          [Op.gt]: currentDate
        }
      },
      order: [['startDateTime', 'ASC']],
      limit
    });
  }

  async getEventsByCategory(category) {
    return await this.model.findAll({
      where: { 
        category,
        isActive: true,
        status: 'published'
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async getActiveEventById(id) {
    return await this.model.findOne({
      where: { 
        id,
        isActive: true 
      }
    });
  }

  async getEventsByDateRange(startDate, endDate) {
    const { Op } = require('sequelize');
    
    return await this.model.findAll({
      where: { 
        isActive: true,
        status: 'published',
        startDateTime: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async getEventsByType(eventType) {
    return await this.model.findAll({
      where: { 
        eventType,
        isActive: true,
        status: 'published'
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async getEventsByConsultationType(consultationType) {
    return await this.model.findAll({
      where: { 
        consultationType,
        isActive: true,
        status: 'published'
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async searchEventsByTags(tags) {
    const { Op } = require('sequelize');
    
    return await this.model.findAll({
      where: { 
        isActive: true,
        status: 'published',
        tags: {
          [Op.overlap]: tags
        }
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async softDelete(id) {
    return await this.model.update(
      { isActive: false },
      { where: { id } }
    );
  }

  async getEventsByPage(pageId) {
    return await this.model.findAll({
      where: { 
        pageId,
        isActive: true,
        status: 'published'
      },
      order: [['startDateTime', 'ASC']]
    });
  }

  async getEventsWithPagination(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { isActive: true, status: 'published', ...filters };

    return await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [['startDateTime', 'ASC']]
    });
  }

  async getPastEvents(limit = 10) {
    const { Op } = require('sequelize');
    const currentDate = new Date();
    
    return await this.model.findAll({
      where: { 
        isActive: true,
        status: 'completed',
        endDateTime: {
          [Op.lt]: currentDate
        }
      },
      order: [['endDateTime', 'DESC']],
      limit
    });
  }

  async updateEventStatus(id, status) {
    return await this.model.update(
      { status },
      { where: { id } }
    );
  }
}

module.exports = EventRepo;