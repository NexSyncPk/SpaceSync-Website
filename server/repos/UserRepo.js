const BaseRepo = require('./BaseRepo');
const { Consultation } = require('../models');

class ConsultationRepo extends BaseRepo {
  constructor() {
    super(Consultation);
  }

  async getActiveConsultations() {
    return await this.model.findAll({
      where: { 
        isActive: true 
      },
      order: [['rating', 'DESC'], ['reviewCount', 'DESC']]
    });
  }

  async getConsultationsByType(type) {
    return await this.model.findAll({
      where: { 
        consultationType: type,
        isActive: true
      },
      order: [['rating', 'DESC']]
    });
  }

  async getTopRatedConsultations(limit = 6) {
    const { Op } = require('sequelize');
    return await this.model.findAll({
      where: { 
        isActive: true,
        rating: {
          [Op.gte]: 4.5
        }
      },
      order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
      limit
    });
  }

  async getActiveConsultationById(id) {
    return await this.model.findOne({
      where: { 
        id,
        isActive: true 
      }
    });
  }

  async getConsultationsByExpert(expertName) {
    return await this.model.findAll({
      where: { 
        expertName,
        isActive: true
      },
      order: [['rating', 'DESC']]
    });
  }

  async searchBySpecialty(specialty) {
    const { Op } = require('sequelize');
    return await this.model.findAll({
      where: { 
        isActive: true,
        specialties: {
          [Op.contains]: [specialty]
        }
      },
      order: [['rating', 'DESC']]
    });
  }

  async softDelete(id) {
    return await this.model.update(
      { isActive: false },
      { where: { id } }
    );
  }

  async getConsultationsByPage(pageId) {
    return await this.model.findAll({
      where: { 
        pageId,
        isActive: true
      },
      order: [['rating', 'DESC']]
    });
  }

  async getConsultationsWithPagination(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    const where = { isActive: true, ...filters };

    return await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [['rating', 'DESC'], ['reviewCount', 'DESC']]
    });
  }
}

module.exports = ConsultationRepo;
