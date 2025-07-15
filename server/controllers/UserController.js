const BaseController = require("./BaseController");
const UserRepo = require("../repos/UserRepo");
const OrganizationRepo = require("../repos/OrganizationRepo");
const UserValidator = require("../validators/UserValidator");
const OrganizationValidator = require("../validators/OrganizationValidator");
const jwt = require("jsonwebtoken");

class UserController extends BaseController {
  constructor() {
    super();
    this.userRepo = new UserRepo();
    this.organizationRepo = new OrganizationRepo();
    this.userValidator = new UserValidator();
    this.organizationValidator = new OrganizationValidator();
  }

  register = async (req, res, next) => {
    const validationResult = this.userValidator.validateCreateUser(req.body);
    if (!validationResult.success) {
      return this.failureResponse("Validation failed", next, 422);
    }

    const { name, email, password, phone, department, position } =
      validationResult.data;

    const existingUser = await this.userRepo.getUserByEmail(email);
    if (existingUser) {
      return this.failureResponse(
        "User already exists with this email",
        next,
        409
      );
    }

    const userData = {
      name,
      email,
      password,
      phone,
      department,
      position,
      role: "unassigned",
      organizationId: null,
    };

    const user = await this.userRepo.createUser(userData);

    return this.successResponse(
      res,
      "User registered successfully",
      {
        user,
        canCreateOrganization: true,
        canJoinOrganization: true,
      },
      201
    );
  };

  login = async (req, res, next) => {
    const validationResult = this.userValidator.validateLoginUser(req.body);
    if (!validationResult.success) {
      return this.failureResponse("Validation failed", next, 422);
    }

    const { email, password } = validationResult.data;

    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      return this.failureResponse("Invalid email or password", next, 401);
    }

    const isPasswordValid = await this.userRepo.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return this.failureResponse("Invalid email or password", next, 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return this.successResponse(res, "Login successful", {
      user: userWithoutPassword,
      token,
      canCreateOrganization: user.role === "unassigned" && !user.organizationId,
      canJoinOrganization: user.role === "unassigned" && !user.organizationId,
    });
  };

  createOrganization = async (req, res, next) => {
    const userId = req.user.userId;

    const user = await this.userRepo.getUserById(userId);
    if (user.organizationId) {
      return this.failureResponse(
        "You already belong to an organization",
        next,
        409
      );
    }

    if (user.role !== "unassigned") {
      return this.failureResponse(
        "Only unassigned users can create organizations",
        next,
        403
      );
    }

    // Use proper validation
    const validationResult =
      this.organizationValidator.validateCreateOrganization(req.body);
    if (!validationResult.success) {
      return this.failureResponse(validationResult.message[0], next, 400);
    }

    const organization = await this.organizationRepo.createOrganization(
      validationResult.data
    );

    await this.userRepo.joinOrganization(userId, organization.id, "admin");

    const updatedUser = await this.userRepo.getUserById(userId);

    // Issue a new JWT token with updated organization information
    const newToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        organizationId: updatedUser.organizationId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return this.successResponse(
      res,
      "Organization created successfully. You are now an admin!",
      {
        organization,
        user: updatedUser,
        inviteKey: organization.inviteKey,
        token: newToken,
      },
      201
    );
  };

  joinOrganization = async (req, res, next) => {
    const userId = req.user.userId;
    const { inviteKey } = req.body;

    const user = await this.userRepo.getUserById(userId);
    if (user.organizationId) {
      return this.failureResponse(
        "You already belong to an organization",
        next,
        409
      );
    }

    if (user.role !== "unassigned") {
      return this.failureResponse(
        "Only unassigned users can join organizations",
        next,
        403
      );
    }

    if (!inviteKey) {
      return this.failureResponse("Invite key is required", next, 422);
    }

    const organization = await this.organizationRepo.getOrganizationByInviteKey(
      inviteKey
    );
    if (!organization) {
      return this.failureResponse("Invalid invite key", next, 404);
    }

    await this.userRepo.joinOrganization(userId, organization.id, "employee");

    console.log(`🚀 User ${userId} joined organization ${organization.id}`);

    // Get fresh user data with organization details
    const updatedUser = await this.userRepo.getUserById(userId);
    
    console.log(`📋 Updated user data:`, {
      userId: updatedUser.id,
      organizationId: updatedUser.organizationId,
      role: updatedUser.role,
      name: updatedUser.name
    });
    
    // Verify the update was successful
    if (!updatedUser.organizationId || updatedUser.organizationId !== organization.id) {
      return this.failureResponse("Failed to join organization. Please try again.", next, 500);
    }

    // Issue a new JWT token with updated organization information
    const newToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        organizationId: updatedUser.organizationId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return this.successResponse(res, "Successfully joined organization!", {
      organization,
      user: updatedUser,
      token: newToken,
    });
  };

  getUserById = async (req, res, next) => {
    const { userId } = req.params;
    const requestingUser = req.user;

    if (requestingUser.userId !== userId && requestingUser.role !== "admin") {
      return this.failureResponse("Access denied", next, 403);
    }

    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      return this.failureResponse("User not found", next, 404);
    }

    return this.successResponse(res, "User retrieved successfully", user);
  };

  updateUser = async (req, res, next) => {
    const { userId } = req.params;
    const requestingUser = req.user;

    if (requestingUser.userId !== userId && requestingUser.role !== "admin") {
      return this.failureResponse("Access denied", next, 403);
    }

    const validationResult = this.userValidator.validateUpdateUser(req.body);
    if (!validationResult.success) {
      return this.failureResponse("Validation failed", next, 422);
    }

    const user = await this.userRepo.updateUser(userId, validationResult.data);

    return this.successResponse(res, "User updated successfully", user);
  };

  getProfile = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await this.userRepo.getUserById(userId);

    return this.successResponse(res, "Profile retrieved successfully", {
      user,
      canCreateOrganization: user.role === "unassigned" && !user.organizationId,
      canJoinOrganization: user.role === "unassigned" && !user.organizationId,
    });
  };

  getCurrentProfile = async (req, res) => {
    try {
      // Fetch fresh user data from database
      const user = await this.userRepo.getUserById(req.user.userId);
      
      if (!user) {
        return this.errorResponse(res, "User not found", {}, 404);
      }

      // Exclude sensitive information
      const { password, ...userResponse } = user.toJSON();

      return this.successResponse(res, "Current profile retrieved successfully", {
        user: userResponse,
        canCreateOrganization: user.role === "unassigned" && !user.organizationId,
        canJoinOrganization: user.role === "unassigned" && !user.organizationId,
      });
    } catch (error) {
      return this.errorResponse(res, "Failed to retrieve current profile", error.message, 500);
    }
  };
}

module.exports = new UserController();
