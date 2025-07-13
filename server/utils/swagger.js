const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SpaceSync API",
      version: "1.0.0",
      description: "SpaceSync is a comprehensive room reservation and workspace management system. This API provides endpoints for user management, organization administration, room booking, and real-time notifications.",
      contact: {
        name: "SpaceSync API Support",
        email: "support@spacesync.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Development server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'"
        }
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User's unique identifier"
            },
            name: {
              type: "string",
              description: "User's full name"
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address"
            },
            password: {
              type: "string",
              minLength: 6,
              maxLength: 100,
              description: "User's password (6-100 characters)"
            },
            phone: {
              type: "string",
              nullable: true,
              pattern: "^\\+?[1-9]\\d{1,14}$",
              description: "User's phone number"
            },
            department: {
              type: "string",
              nullable: true,
              description: "User's department"
            },
            position: {
              type: "string",
              nullable: true,
              description: "User's position/job title"
            },
            role: {
              type: "string",
              enum: ["admin", "employee", "unassigned"],
              default: "unassigned",
              description: "User's role in the organization"
            },
            organizationId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "ID of the organization the user belongs to"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp"
            }
          }
        },
        UserRegister: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              description: "User's full name"
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address"
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User's password (minimum 6 characters)"
            }
          }
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address"
            },
            password: {
              type: "string",
              description: "User's password"
            }
          }
        },
        Organization: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Organization's unique identifier"
            },
            name: {
              type: "string",
              description: "Organization name"
            },
            description: {
              type: "string",
              nullable: true,
              description: "Organization description"
            },
            inviteKey: {
              type: "string",
              description: "Unique invite key for joining the organization"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Organization creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Organization last update timestamp"
            }
          }
        },
        Room: {
          type: "object",
          required: ["name", "capacity"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Room's unique identifier"
            },
            name: {
              type: "string",
              description: "Room name"
            },
            capacity: {
              type: "integer",
              minimum: 1,
              description: "Room capacity (number of people)"
            },
            displayProjector: {
              type: "boolean",
              default: false,
              description: "Whether the room has a projector"
            },
            displayWhiteboard: {
              type: "boolean",
              default: false,
              description: "Whether the room has a whiteboard"
            },
            cateringAvailable: {
              type: "boolean",
              default: false,
              description: "Whether catering is available in the room"
            },
            videoConferenceAvailable: {
              type: "boolean",
              default: false,
              description: "Whether video conferencing is available in the room"
            },
            organizationId: {
              type: "string",
              format: "uuid",
              description: "ID of the organization that owns the room"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Room creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Room last update timestamp"
            }
          }
        },
        Reservation: {
          type: "object",
          required: ["agenda", "startTime", "endTime", "roomId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Reservation's unique identifier"
            },
            agenda: {
              type: "string",
              description: "Meeting agenda or purpose"
            },
            startTime: {
              type: "string",
              format: "date-time",
              description: "Reservation start date and time"
            },
            endTime: {
              type: "string",
              format: "date-time",
              description: "Reservation end date and time"
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "completed"],
              default: "pending",
              description: "Reservation status"
            },
            internalAttendees: {
              type: "array",
              items: {
                type: "string",
                format: "uuid"
              },
              description: "Array of user IDs who are internal attendees"
            },
            requiredAmenities: {
              type: "array",
              items: {
                type: "string",
                enum: ["displayProjector", "displayWhiteboard", "cateringAvailable", "videoConferenceAvailable"]
              },
              description: "Array of required room amenities for this reservation"
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who made the reservation"
            },
            roomId: {
              type: "string",
              format: "uuid",
              description: "ID of the reserved room"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Reservation creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Reservation last update timestamp"
            }
          }
        },
        ExternalAttendee: {
          type: "object",
          required: ["name", "email"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "External attendee's unique identifier"
            },
            name: {
              type: "string",
              description: "External attendee's name"
            },
            email: {
              type: "string",
              format: "email",
              description: "External attendee's email address"
            },
            phone: {
              type: "string",
              nullable: true,
              description: "External attendee's phone number"
            },
            reservationId: {
              type: "string",
              format: "uuid",
              description: "ID of the reservation this attendee is invited to"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "External attendee creation timestamp"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "External attendee last update timestamp"
            }
          }
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful"
            },
            message: {
              type: "string",
              description: "Response message"
            },
            data: {
              type: "object",
              description: "Response data"
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Always false for error responses"
            },
            message: {
              type: "string",
              description: "Error message"
            },
            error: {
              type: "string",
              description: "Detailed error information"
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./router/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
