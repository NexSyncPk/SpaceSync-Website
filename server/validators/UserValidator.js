const Joi = require('joi');
const BaseValidator = require('./BaseValidator');

class UserValidator extends BaseValidator {
    // Schema for user registration
    createUserSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 2 characters long',
                'string.max': 'Name cannot exceed 100 characters'
            }),
        
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required'
            }),
        
        password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password cannot exceed 100 characters',
                'string.empty': 'Password is required'
            }),
        
        role: Joi.string()
            .valid('admin', 'employee', 'unassigned')
            .default('unassigned')
            .messages({
                'any.only': 'Role must be admin, employee, or unassigned'
            }),
        
        organizationId: Joi.string()
            .uuid()
            .messages({
                'string.guid': 'Organization ID must be a valid UUID',
                'string.empty': 'Organization ID is required'
            })
    });

    // Schema for user login
    loginUserSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required'
            }),
        
        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required'
            })
    });

    // Schema for updating user
    updateUserSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Name must be at least 2 characters long',
                'string.max': 'Name cannot exceed 100 characters'
            }),
        
        email: Joi.string()
            .email()
            .messages({
                'string.email': 'Please enter a valid email address'
            }),
        
        role: Joi.string()
            .valid('admin', 'employee', 'unassigned')
            .messages({
                'any.only': 'Role must be admin, employee, or unassigned'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    // Schema for password change
    changePasswordSchema = Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'string.empty': 'Current password is required'
            }),
        
        newPassword: Joi.string()
            .min(6)
            .max(100)
            .required()
            .messages({
                'string.min': 'New password must be at least 6 characters long',
                'string.max': 'New password cannot exceed 100 characters',
                'string.empty': 'New password is required'
            })
    });

    validateCreateUser = (data) => this.validate(this.createUserSchema, data);
    validateLoginUser = (data) => this.validate(this.loginUserSchema, data);
    validateUpdateUser = (data) => this.validate(this.updateUserSchema, data);
    validateChangePassword = (data) => this.validate(this.changePasswordSchema, data);
}

module.exports = UserValidator;
