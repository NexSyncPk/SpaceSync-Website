const BaseController = require('./BaseController');
const { HeroSection, TeamSection, TestimonialSection, FindUsSection, Page, PageSection } = require('../models');

class ContentController extends BaseController {
  // Hero Section Methods
  async getHeroSection(req, res) {
    const heroSection = await HeroSection.findOne({
      where: { isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }]
    });
    
    if (!heroSection) {
      return this.sendErrorResponse(res, 404, 'Hero section not found');
    }
    
    return this.sendResponse(res, 200, 'Hero section retrieved successfully', heroSection);
  }

  async updateHeroSection(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await HeroSection.update(updateData, {
      where: { id: id || 1, isDeleted: false }
    });

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Hero section not found');
    }

    const updatedHeroSection = await HeroSection.findByPk(id || 1);
    return this.sendResponse(res, 200, 'Hero section updated successfully', updatedHeroSection);
  }

  async createHeroSection(req, res) {
    const heroData = req.body;
    const heroSection = await HeroSection.create(heroData);
    return this.sendResponse(res, 201, 'Hero section created successfully', heroSection);
  }

  // Team Section Methods
  async getTeamSection(req, res) {
    const teamMembers = await TeamSection.findAll({
      where: { isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }],
      order: [['createdAt', 'ASC']]
    });
    
    return this.sendResponse(res, 200, 'Team members retrieved successfully', teamMembers);
  }

  async getTeamMemberById(req, res) {
    const { id } = req.params;
    const teamMember = await TeamSection.findOne({
      where: { id, isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }]
    });

    if (!teamMember) {
      return this.sendErrorResponse(res, 404, 'Team member not found');
    }

    return this.sendResponse(res, 200, 'Team member retrieved successfully', teamMember);
  }

  async createTeamMember(req, res) {
    const teamData = req.body;
    const teamMember = await TeamSection.create(teamData);
    return this.sendResponse(res, 201, 'Team member created successfully', teamMember);
  }

  async updateTeamMember(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await TeamSection.update(updateData, {
      where: { id, isDeleted: false }
    });

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Team member not found');
    }

    const updatedTeamMember = await TeamSection.findByPk(id);
    return this.sendResponse(res, 200, 'Team member updated successfully', updatedTeamMember);
  }

  async deleteTeamMember(req, res) {
    const { id } = req.params;
    
    const [updatedRowsCount] = await TeamSection.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } }
    );

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Team member not found');
    }

    return this.sendResponse(res, 200, 'Team member deleted successfully');
  }

  // Testimonial Section Methods
  async getTestimonials(req, res) {
    const testimonials = await TestimonialSection.findAll({
      where: { isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    return this.sendResponse(res, 200, 'Testimonials retrieved successfully', testimonials);
  }

  async getTestimonialById(req, res) {
    const { id } = req.params;
    const testimonial = await TestimonialSection.findOne({
      where: { id, isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }]
    });

    if (!testimonial) {
      return this.sendErrorResponse(res, 404, 'Testimonial not found');
    }

    return this.sendResponse(res, 200, 'Testimonial retrieved successfully', testimonial);
  }

  async createTestimonial(req, res) {
    const testimonialData = req.body;
    const testimonial = await TestimonialSection.create(testimonialData);
    return this.sendResponse(res, 201, 'Testimonial created successfully', testimonial);
  }

  async updateTestimonial(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await TestimonialSection.update(updateData, {
      where: { id, isDeleted: false }
    });

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Testimonial not found');
    }

    const updatedTestimonial = await TestimonialSection.findByPk(id);
    return this.sendResponse(res, 200, 'Testimonial updated successfully', updatedTestimonial);
  }

  async deleteTestimonial(req, res) {
    const { id } = req.params;
    
    const [updatedRowsCount] = await TestimonialSection.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } }
    );

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Testimonial not found');
    }

    return this.sendResponse(res, 200, 'Testimonial deleted successfully');
  }

  // Contact/FindUs Section Methods
  async getFindUsData(req, res) {
    const findUsData = await FindUsSection.findOne({
      where: { isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }]
    });
    
    if (!findUsData) {
      return this.sendErrorResponse(res, 404, 'Contact information not found');
    }
    
    return this.sendResponse(res, 200, 'Contact information retrieved successfully', findUsData);
  }
  async updateFindUsData(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await FindUsSection.update(updateData, {
      where: { id: id || 1, isDeleted: false }
    });

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Contact information not found');
    }

    const updatedFindUs = await FindUsSection.findByPk(id || 1);
    return this.sendResponse(res, 200, 'Contact information updated successfully', updatedFindUs);
  }

  // Page Section Methods
  async getPageSections(req, res) {
    const { pageId, sectionType } = req.query;
    const whereClause = { isDeleted: false };
    
    if (pageId) whereClause.pageId = pageId;
    if (sectionType) whereClause.sectionType = sectionType;
    
    const sections = await PageSection.findAll({
      where: whereClause,
      include: [{
        model: Page,
        as: 'page'
      }],
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    return this.sendResponse(res, 200, 'Page sections retrieved successfully', sections);
  }

  async getPageSection(req, res) {
    const { id } = req.params;
    const section = await PageSection.findOne({
      where: { id, isDeleted: false },
      include: [{
        model: Page,
        as: 'page'
      }]
    });

    if (!section) {
      return this.sendErrorResponse(res, 404, 'Page section not found');
    }

    return this.sendResponse(res, 200, 'Page section retrieved successfully', section);
  }

  async createPageSection(req, res) {
    const sectionData = req.body;
    const section = await PageSection.create(sectionData);
    return this.sendResponse(res, 201, 'Page section created successfully', section);
  }

  async updatePageSection(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    
    const [updatedRowsCount] = await PageSection.update(updateData, {
      where: { id, isDeleted: false }
    });

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Page section not found');
    }

    const updatedSection = await PageSection.findByPk(id);
    return this.sendResponse(res, 200, 'Page section updated successfully', updatedSection);
  }

  async deletePageSection(req, res) {
    const { id } = req.params;
    
    const [updatedRowsCount] = await PageSection.update(
      { isDeleted: true },
      { where: { id, isDeleted: false } }
    );

    if (updatedRowsCount === 0) {
      return this.sendErrorResponse(res, 404, 'Page section not found');
    }

    return this.sendResponse(res, 200, 'Page section deleted successfully');
  }

  // Get sections by page and type - convenience method
  async getSectionsByPageAndType(req, res) {
    const { pageType, sectionType } = req.params;
    
    const sections = await PageSection.findAll({
      where: { 
        sectionType,
        isDeleted: false,
        isActive: true
      },
      include: [{
        model: Page,
        as: 'page',
        where: { pageType }
      }],
      order: [['order', 'ASC']]
    });
    
    return this.sendResponse(res, 200, `${sectionType} sections retrieved successfully`, sections);
  }
}

module.exports = ContentController;
