const BaseRepo = require("./BaseRepo");
const Organization = require("../models/organization");

class OrganizationRepo extends BaseRepo {
    constructor() {
        super(Organization);
    }

    async getAllOrganizations(){
      return await this.model.findAll();
    }

    async getOrganizationById(id){
      return await this.model.findById(id);
    }

    async createOrganization(organizationData){
      return await this.model.create(organizationData);
    }

    async updateOrganization(id, organizationData){
      return await this.model.update(organizationData, id);
    }

    async deleteOrganization(id){
      return await this.model.delete(id);
    }
}

module.exports = OrganizationRepo;
