const Joi = require('joi');
const BaseValidator = require('./BaseValidator');

class RoomValidator extends BaseValidator {
    // Schema for creating room
    createRoomSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Room name is required',
                'string.min': 'Room name must be at least 2 characters long',
                'string.max': 'Room name cannot exceed 100 characters'
            }),
        
        capacity: Joi.number()
            .integer()
            .min(1)
            .max(1000)
            .required()
            .messages({
                'number.base': 'Capacity must be a number',
                'number.integer': 'Capacity must be a whole number',
                'number.min': 'Capacity must be at least 1',
                'number.max': 'Capacity cannot exceed 1000',
                'any.required': 'Capacity is required'
            }),
        
        displayProjector: Joi.boolean()
            .default(false)
            .messages({
                'boolean.base': 'Display projector must be true or false'
            }),
        
        displayWhiteboard: Joi.boolean()
            .default(false)
            .messages({
                'boolean.base': 'Display whiteboard must be true or false'
            }),
        
        cateringAvailable: Joi.boolean()
            .default(false)
            .messages({
                'boolean.base': 'Catering available must be true or false'
            }),
        
        videoConferenceAvailable: Joi.boolean()
            .default(false)
            .messages({
                'boolean.base': 'Video conference available must be true or false'
            }),
        
        organizationId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Organization ID must be a valid UUID',
                'string.empty': 'Organization ID is required'
            })
    });

    // Schema for updating room
    updateRoomSchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Room name must be at least 2 characters long',
                'string.max': 'Room name cannot exceed 100 characters'
            }),
        
        capacity: Joi.number()
            .integer()
            .min(1)
            .max(1000)
            .messages({
                'number.base': 'Capacity must be a number',
                'number.integer': 'Capacity must be a whole number',
                'number.min': 'Capacity must be at least 1',
                'number.max': 'Capacity cannot exceed 1000'
            }),
        
        displayProjector: Joi.boolean()
            .messages({
                'boolean.base': 'Display projector must be true or false'
            }),
        
        displayWhiteboard: Joi.boolean()
            .messages({
                'boolean.base': 'Display whiteboard must be true or false'
            }),
        
        cateringAvailable: Joi.boolean()
            .messages({
                'boolean.base': 'Catering available must be true or false'
            }),
        
        videoConferenceAvailable: Joi.boolean()
            .messages({
                'boolean.base': 'Video conference available must be true or false'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    // Schema for room search/filter
    searchRoomSchema = Joi.object({
        capacity: Joi.number()
            .integer()
            .min(1)
            .messages({
                'number.base': 'Capacity must be a number',
                'number.integer': 'Capacity must be a whole number',
                'number.min': 'Capacity must be at least 1'
            }),
        
        displayProjector: Joi.boolean()
            .messages({
                'boolean.base': 'Display projector must be true or false'
            }),
        
        displayWhiteboard: Joi.boolean()
            .messages({
                'boolean.base': 'Display whiteboard must be true or false'
            }),
        
        cateringAvailable: Joi.boolean()
            .messages({
                'boolean.base': 'Catering available must be true or false'
            }),
        
        videoConferenceAvailable: Joi.boolean()
            .messages({
                'boolean.base': 'Video conference available must be true or false'
            }),

        startTime: Joi.date()
            .iso()
            .messages({
                'date.format': 'Start time must be a valid ISO date'
            }),

        endTime: Joi.date()
            .iso()
            .greater(Joi.ref('startTime'))
            .messages({
                'date.format': 'End time must be a valid ISO date',
                'date.greater': 'End time must be after start time'
            })
    });

    validateCreateRoom = (data) => this.validate(this.createRoomSchema, data);
    validateUpdateRoom = (data) => this.validate(this.updateRoomSchema, data);
    validateSearchRoom = (data) => this.validate(this.searchRoomSchema, data);
}

module.exports = RoomValidator;
