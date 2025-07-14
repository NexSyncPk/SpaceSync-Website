const Joi = require('joi');
const BaseValidator = require('./BaseValidator');

class OrganizationValidator extends BaseValidator {
    createOrganizationSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Organization name is required',
                'string.min': 'Organization name must be at least 2 characters long',
                'string.max': 'Organization name cannot exceed 100 characters'
            }),
        description: Joi.string()
            .min(1)
            .max(500)
            .required()
            .messages({
                'string.empty': 'Organization description is required',
                'string.min': 'Description must be at least 1 character long',
                'string.max': 'Description cannot exceed 500 characters'
            }),
        inviteKey: Joi.string()
            .min(8)
            .max(50)
            .alphanum()
            .messages({
                'string.min': 'Invite key must be at least 8 characters long',
                'string.max': 'Invite key cannot exceed 50 characters',
                'string.alphanum': 'Invite key must contain only alphanumeric characters'
            })
    });

    // Schema for updating organization
    updateOrganizationSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Organization name must be at least 2 characters long',
                'string.max': 'Organization name cannot exceed 100 characters'
            }),
        
        description: Joi.string()
            .min(1)
            .max(500)
            .messages({
                'string.empty': 'Organization description cannot be empty',
                'string.min': 'Description must be at least 1 character long',
                'string.max': 'Description cannot exceed 500 characters'
            }),
        
        inviteKey: Joi.string()
            .min(8)
            .max(50)
            .alphanum()
            .messages({
                'string.min': 'Invite key must be at least 8 characters long',
                'string.max': 'Invite key cannot exceed 50 characters',
                'string.alphanum': 'Invite key must contain only alphanumeric characters'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    // Schema for joining organization with invite key
    joinOrganizationSchema = Joi.object({
        inviteKey: Joi.string()
            .required()
            .messages({
                'string.empty': 'Invite key is required'
            })
    });

    validateCreateOrganization = (data) => this.validate(this.createOrganizationSchema, data);
    validateUpdateOrganization = (data) => this.validate(this.updateOrganizationSchema, data);
    validateJoinOrganization = (data) => this.validate(this.joinOrganizationSchema, data);
}

module.exports = OrganizationValidator;
