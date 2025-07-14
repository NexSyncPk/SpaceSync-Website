const Joi = require('joi');
const BaseValidator = require('./BaseValidator');

class ReservationValidator extends BaseValidator {
    // Schema for creating reservation
    createReservationSchema = Joi.object({
        roomId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Room ID must be a valid UUID',
                'string.empty': 'Room ID is required'
            }),
        
        startTime: Joi.date()
            .iso()
            .greater('now')
            .required()
            .messages({
                'date.format': 'Start time must be a valid ISO date',
                'date.greater': 'Start time must be in the future',
                'any.required': 'Start time is required'
            }),
        
        endTime: Joi.date()
            .iso()
            .greater(Joi.ref('startTime'))
            .required()
            .messages({
                'date.format': 'End time must be a valid ISO date',
                'date.greater': 'End time must be after start time',
                'any.required': 'End time is required'
            }),
        
        agenda: Joi.string()
            .min(5)
            .max(500)
            .required()
            .messages({
                'string.empty': 'Agenda is required',
                'string.min': 'Agenda must be at least 5 characters long',
                'string.max': 'Agenda cannot exceed 500 characters'
            }),
        
        status: Joi.string()
            .valid('pending', 'confirmed', 'cancelled', 'completed')
            .default('pending')
            .messages({
                'any.only': 'Status must be pending, confirmed, cancelled, or completed'
            }),
        
        internalAttendees: Joi.array()
            .items(
                Joi.string()
                    .uuid()
                    .messages({
                        'string.guid': 'Each internal attendee ID must be a valid UUID'
                    })
            )
            .default([])
            .messages({
                'array.base': 'Internal attendees must be an array'
            }),
        
        externalAttendees: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string()
                        .min(2)
                        .max(100)
                        .required()
                        .messages({
                            'string.empty': 'External attendee name is required',
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
            .default([])
            .messages({
                'array.base': 'External attendees must be an array'
            }),

        requiredAmenities: Joi.array()
            .items(
                Joi.string()
                    .valid('displayProjector', 'displayWhiteboard', 'cateringAvailable', 'videoConferenceAvailable')
                    .messages({
                        'any.only': 'Invalid amenity. Must be one of: displayProjector, displayWhiteboard, cateringAvailable, videoConferenceAvailable'
                    })
            )
            .default([])
            .messages({
                'array.base': 'Required amenities must be an array'
            })
    });

    // Schema for updating reservation
    updateReservationSchema = Joi.object({
        startTime: Joi.date()
            .iso()
            .greater('now')
            .messages({
                'date.format': 'Start time must be a valid ISO date',
                'date.greater': 'Start time must be in the future'
            }),
        
        endTime: Joi.date()
            .iso()
            .greater(Joi.ref('startTime'))
            .messages({
                'date.format': 'End time must be a valid ISO date',
                'date.greater': 'End time must be after start time'
            }),
        
        agenda: Joi.string()
            .min(5)
            .max(500)
            .messages({
                'string.min': 'Agenda must be at least 5 characters long',
                'string.max': 'Agenda cannot exceed 500 characters'
            }),
        
        status: Joi.string()
            .valid('pending', 'confirmed', 'cancelled', 'completed')
            .messages({
                'any.only': 'Status must be pending, confirmed, cancelled, or completed'
            }),
        
        internalAttendees: Joi.array()
            .items(
                Joi.string()
                    .uuid()
                    .messages({
                        'string.guid': 'Each internal attendee ID must be a valid UUID'
                    })
            )
            .messages({
                'array.base': 'Internal attendees must be an array'
            }),

        requiredAmenities: Joi.array()
            .items(
                Joi.string()
                    .valid('displayProjector', 'displayWhiteboard', 'cateringAvailable', 'videoConferenceAvailable')
                    .messages({
                        'any.only': 'Invalid amenity. Must be one of: displayProjector, displayWhiteboard, cateringAvailable, videoConferenceAvailable'
                    })
            )
            .messages({
                'array.base': 'Required amenities must be an array'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    // Schema for reservation search/filter
    searchReservationSchema = Joi.object({
        roomId: Joi.string()
            .uuid()
            .messages({
                'string.guid': 'Room ID must be a valid UUID'
            }),
        
        userId: Joi.string()
            .uuid()
            .messages({
                'string.guid': 'User ID must be a valid UUID'
            }),
        
        status: Joi.string()
            .valid('pending', 'confirmed', 'cancelled', 'completed')
            .messages({
                'any.only': 'Status must be pending, confirmed, cancelled, or completed'
            }),
        
        startDate: Joi.date()
            .iso()
            .messages({
                'date.format': 'Start date must be a valid ISO date'
            }),
        
        endDate: Joi.date()
            .iso()
            .greater(Joi.ref('startDate'))
            .messages({
                'date.format': 'End date must be a valid ISO date',
                'date.greater': 'End date must be after start date'
            }),

        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be a whole number',
                'number.min': 'Page must be at least 1'
            }),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be a whole number',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            })
    });

    // Schema for checking room availability
    checkAvailabilitySchema = Joi.object({
        roomId: Joi.string()
            .uuid()
            .required()
            .messages({
                'string.guid': 'Room ID must be a valid UUID',
                'string.empty': 'Room ID is required'
            }),
        
        startTime: Joi.date()
            .iso()
            .greater('now')
            .required()
            .messages({
                'date.format': 'Start time must be a valid ISO date',
                'date.greater': 'Start time must be in the future',
                'any.required': 'Start time is required'
            }),
        
        endTime: Joi.date()
            .iso()
            .greater(Joi.ref('startTime'))
            .required()
            .messages({
                'date.format': 'End time must be a valid ISO date',
                'date.greater': 'End time must be after start time',
                'any.required': 'End time is required'
            }),

        excludeReservationId: Joi.string()
            .uuid()
            .messages({
                'string.guid': 'Exclude reservation ID must be a valid UUID'
            })
    });

    // Schema for updating reservation status
    statusUpdateSchema = Joi.object({
        status: Joi.string()
            .valid('pending', 'confirmed', 'cancelled')
            .required()
            .messages({
                'any.only': 'Status must be pending, confirmed, or cancelled',
                'any.required': 'Status is required'
            })
    });

    validateCreateReservation = (data) => this.validate(this.createReservationSchema, data);
    validateUpdateReservation = (data) => this.validate(this.updateReservationSchema, data);
    validateSearchReservation = (data) => this.validate(this.searchReservationSchema, data);
    validateCheckAvailability = (data) => this.validate(this.checkAvailabilitySchema, data);
    validateStatusUpdate = (data) => this.validate(this.statusUpdateSchema, data);
}

module.exports = ReservationValidator;
