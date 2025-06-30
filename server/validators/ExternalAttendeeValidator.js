const Joi = require('joi');
const BaseValidator = require('./BaseValidator');

class ExternalAttendeeValidator extends BaseValidator {
    // Schema for creating external attendee
    createExternalAttendeeSchema = Joi.object({
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
            .messages({
                'string.email': 'Please enter a valid email address'
            }),
        
        phone: Joi.string()
            .pattern(/^[\+]?[1-9][\d]{0,15}$/)
            .messages({
                'string.pattern.base': 'Please enter a valid phone number'
            }),
        
        reservationId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Reservation ID must be a valid UUID',
                'string.empty': 'Reservation ID is required'
            })
    });

    // Schema for updating external attendee
    updateExternalAttendeeSchema = Joi.object({
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
        
        phone: Joi.string()
            .pattern(/^[\+]?[1-9][\d]{0,15}$/)
            .messages({
                'string.pattern.base': 'Please enter a valid phone number'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    // Schema for bulk creating external attendees
    bulkCreateExternalAttendeesSchema = Joi.object({
        attendees: Joi.array()
            .items(
                Joi.object({
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
                        .messages({
                            'string.email': 'Please enter a valid email address'
                        }),
                    
                    phone: Joi.string()
                        .pattern(/^[\+]?[1-9][\d]{0,15}$/)
                        .messages({
                            'string.pattern.base': 'Please enter a valid phone number'
                        })
                })
            )
            .min(1)
            .max(50)
            .required()
            .messages({
                'array.base': 'Attendees must be an array',
                'array.min': 'At least one attendee is required',
                'array.max': 'Cannot add more than 50 attendees at once',
                'any.required': 'Attendees array is required'
            }),
        
        reservationId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Reservation ID must be a valid UUID',
                'string.empty': 'Reservation ID is required'
            })
    });

    validateCreateExternalAttendee = (data) => this.validate(this.createExternalAttendeeSchema, data);
    validateUpdateExternalAttendee = (data) => this.validate(this.updateExternalAttendeeSchema, data);
    validateBulkCreateExternalAttendees = (data) => this.validate(this.bulkCreateExternalAttendeesSchema, data);
}

module.exports = ExternalAttendeeValidator;
