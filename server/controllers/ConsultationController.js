const ConsultationRepo = require('../repos/ConsultationRepo');
const BaseController = require('./BaseController');

class ConsultationController extends BaseController {
  constructor() {
    super();
    this.consultationRepo = new ConsultationRepo();
  }

  // Get all active consultations
  async getActiveConsultations(req, res) {
    const consultations = await this.consultationRepo.getActiveConsultations();
    return this.sendResponse(res, 200, 'Consultations retrieved successfully', consultations);
  }

  // Get consultations by type
  async getConsultationsByType(req, res) {
    const { type } = req.params;
    const consultations = await this.consultationRepo.getConsultationsByType(type);
    return this.sendResponse(res, 200, `${type} consultations retrieved successfully`, consultations);
  }

  // Get top-rated consultations
  async getTopRatedConsultations(req, res) {
    const limit = req.query.limit || 6;
    const consultations = await this.consultationRepo.getTopRatedConsultations(limit);
    return this.sendResponse(res, 200, 'Top-rated consultations retrieved successfully', consultations);
  }

  // Get consultation by ID
  async getConsultationById(req, res) {
    const { id } = req.params;
    const consultation = await this.consultationRepo.getActiveConsultationById(id);

    if (!consultation) {
      return this.sendErrorResponse(res, 404, 'Consultation not found');
    }
    
    return this.sendResponse(res, 200, 'Consultation retrieved successfully', consultation);
  }

  async getConsultationsByExpert(req, res) {
    const { expertName } = req.params;
    const consultations = await this.consultationRepo.getConsultationsByExpert(expertName);
    return this.sendResponse(res, 200, `Consultations by ${expertName} retrieved successfully`, consultations);
  }

  async searchConsultationsBySpecialty(req, res) {
    const { specialty } = req.query;
    
    if (!specialty) {
      return this.sendErrorResponse(res, 400, 'Specialty parameter is required');
    }

    const consultations = await this.consultationRepo.searchBySpecialty(specialty);
    return this.sendResponse(res, 200, `Consultations with ${specialty} specialty retrieved successfully`, consultations);
  }

  async getConsultationsWithPagination(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {};
    
    if (req.query.consultationType) {
      filters.consultationType = req.query.consultationType;
    }
    if (req.query.expertName) {
      filters.expertName = req.query.expertName;
    }

    const result = await this.consultationRepo.getConsultationsWithPagination(page, limit, filters);    
    return this.sendResponse(res, 200, 'Consultations retrieved successfully', {
      consultations: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit)
      }
    });
  }

  async createConsultation(req, res) {
    const consultationData = req.body;
    const consultation = await this.consultationRepo.create(consultationData);
    return this.sendResponse(res, 201, 'Consultation created successfully', consultation);
  }

  async updateConsultation(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await this.consultationRepo.update(id, updateData);

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Consultation not found');
    }

    const updatedConsultation = await this.consultationRepo.findById(id);
    return this.sendResponse(res, 200, 'Consultation updated successfully', updatedConsultation);
  }

  // Delete consultation (soft delete)
  async deleteConsultation(req, res) {
    const { id } = req.params;
    
    const [updatedRowsCount] = await this.consultationRepo.softDelete(id);

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Consultation not found');
    }

    return this.sendResponse(res, 200, 'Consultation deleted successfully');
  }
}

module.exports = ConsultationController;