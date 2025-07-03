import { number, z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

// Signup validation schema
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .length(11, 'Phone number must be exactly 11 digits')
    .regex(/^(03|021)\d{9}$/, 'Phone number must start with 03 or 021 and be 11 digits long'),
  department: z
    .string()
    .min(1, 'Department is required')
    .min(2, 'Department must be at least 2 characters long'),
  position: z
    .string()
    .min(1, 'Position is required')
    .min(2, 'Position must be at least 2 characters long')
    .max(100, 'Position must be less than 100 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);


// Meeting request base shape for reuse
export const meetingRequestBaseShape = {
  id: z.number().int().optional(),
  meetingTitle: z
    .string()
    .min(1, 'Meeting title is required')
    .min(3, 'Meeting title must be at least 3 characters long')
    .max(100, 'Meeting title must be less than 100 characters'),
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  department: z
    .string()
    .min(1, 'Department is required')
    .min(2, 'Department must be at least 2 characters long'),
  teamAgenda: z
    .string()
    .min(1, 'Team agenda is required')
    .min(10, 'Team agenda must be at least 10 characters long')
    .max(500, 'Team agenda must be less than 500 characters'),
  startTime: z
    .string()
    .min(1, 'Start time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  endTime: z
    .string()
    .min(1, 'End time is required')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  numberOfAttendees: z
    .number()
    .min(1, 'At least 1 attendee is required')
    .max(50, 'Maximum 50 attendees allowed'),
  meetingType: z
    .enum(['internal', 'external'], {
      required_error: 'Please select meeting type',
    }),
  roomId: z.number({ required_error: 'Room is required' }),
  requirements: z
    .array(z.string())
    .default([]),
  status: z.enum(['pending', 'approved', 'completed', 'cancelled']).default('pending'),
};

export const meetingRequestSchema = z.object(meetingRequestBaseShape)
  .refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      return end > start;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return diffInMinutes >= 30;
    },
    {
      message: 'Meeting must be at least 30 minutes long',
      path: ['endTime'],
    }
  );

// Validation schema for booking modification (updated fields)
export const modifyBookingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  agenda: z.string().min(1, "Agenda is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  noOfAttendees: z.coerce.number().min(1, "Number of attendees is required"),
  meetingType: z.enum(["Internal", "External"], {
    errorMap: () => ({ message: "Meeting type is required" }),
  }),
  room: z.string().min(1, "Room is required"),
});



// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type MeetingRequestFormData = z.infer<typeof meetingRequestSchema>;
export type ModifyBookingFormData = z.infer<typeof modifyBookingSchema>;
