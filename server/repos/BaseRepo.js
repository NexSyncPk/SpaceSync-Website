class BaseRepo {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findOne(condition) {
        return await this.model.findOne({ where: condition });
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findAll(condition = {}) {
        return await this.model.findAll({ where: condition });
    }

    async update(data, condition) {
        return await this.model.update(data, { where: condition });
    }

    async delete(id) {
        return await this.model.destroy({ where: { id } });
    }
}

module.exports = BaseRepo;
