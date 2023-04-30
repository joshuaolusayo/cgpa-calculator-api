/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");
const generateToken = require("../utilities/generateToken");
const crypto = require("crypto");

class UserController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("User");
    this.OrganizationModel = this.get_model("Organization");
    this.TokenModel = this.get_model("Token");
  }

  async getAllUsers() {
    const users = await this.Model.find({});
    if (users) {
      return this.process_successful_response({
        message: "Successfully fetched all users",
        users,
        total: users.length,
      });
    }
    return this.process_failed_response("Unable to retrieve user details", 500);
  }

  async login(data) {
    const { email, password } = data;

    const user = await this.Model.findOne({ email });

    if (!user)
      return this.process_failed_response("Invalid email address or password");

    if (await user.matchPassword(password)) {
      return this.process_successful_response({
        message: "Successfully registered",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken({
          userId: user._id,
          organizationId: user?.organization?.toString(),
          email: user.email,
          role: user.role,
        }),
        createdAt: user.createdAt,
      });
    } else {
      return this.process_failed_response("Password doesn't match");
    }
  }

  async create_organization_admin(userDetails) {
    const { name, email, password, organizationName } = userDetails;
    if (!name || !email || !password || !organizationName)
      return this.process_failed_response("Invalid request");

    try {
      const existingUser = await this.check_if_exists("User", { email });

      if (existingUser) {
        return this.process_failed_response(
          "User with that email already exists",
          400
        );
      }
      const existingOrganization = await this.check_if_exists("Organization", {
        name: organizationName,
      });
      if (existingOrganization) {
        return this.process_failed_response(
          "Organization with that name already exists",
          400
        );
      }
      const user = await this.Model.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: "organization_admin",
      });
      if (user) {
        const verificationToken = await this.create_verification_token(
          user._id
        );

        const newOrganization = await this.create_organization(
          organizationName,
          user._id
        );

        user.organization = newOrganization._id;
        await user.save();

        return this.process_successful_response(
          {
            message: "Account created successfully",
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            organizationId: newOrganization._id,
            organizationName: newOrganization.name,
            verificationToken,
          },
          201
        );
      }
      return this.process_failed_response("Unable to create user", 500);
    } catch (e) {
      return this.process_failed_response("An error occured here");
    }
  }

  async verify_user_email_address(params) {
    const { emailToken: token } = params;
    if (!token) return this.process_failed_response("Token must be present");
    const existingToken = await this.TokenModel.findOne({ token });
    if (!existingToken) {
      return this.process_failed_response(
        "Invalid or expired confirmation token"
      );
    }

    const user = await this.Model.findById(existingToken._userId);
    if (!user)
      return this.process_failed_response("User with the token not found");

    if (user.isVerified)
      return this.process_successful_response(
        "Email address is verified already"
      );
    user.isVerified = true;
    await user.save();
    await existingToken.deleteOne();
    return this.process_successful_response({
      message: "Email address verified successfully",
      token: generateToken(user._id),
    });
  }

  async resend_verification_token(body) {
    const { email } = body;

    const user = await this.Model.findOne({ email });

    if (!user) {
      return this.process_failed_response("User not found");
    }

    if (user.isVerified) {
      return this.process_failed_response(
        "This account has already been verified"
      );
    }

    const existingToken = await this.TokenModel.findOne({ _userId: user._id });
    if (existingToken)
      return this.process_successful_response({
        message: "Verification email has been resent.",
        verificationToken: existingToken.token,
      });

    const verificationToken = await this.create_verification_token(user._id);

    return this.process_successful_response({
      message: "Verification email has been resent.",
      verificationToken,
    });
  }

  async create_organization(name, admin_id) {
    try {
      const newOrganization = await this.OrganizationModel.create({
        name,
        admin: admin_id.toString(),
      });

      return newOrganization;
    } catch (e) {
      // logger.console(e.message, "update_records");
    }
  }

  async create_verification_token(_userId) {
    const verificationToken = await this.TokenModel.create({
      _userId,
      token: crypto.randomBytes(32).toString("hex"),
    });
    return verificationToken.token;
  }

  async get_current_user_details(user) {
    const userDetails = await this.Model.findOne({ _id: user._id }).populate({
      path: "organization",
      select: "name",
    });

    if (!userDetails) return this.process_failed_response("User not found");
    return this.process_successful_response({
      message: "Successfully fetched user details",
      user: {
        id: userDetails._id,
        email: userDetails.email,
        role: userDetails.role,
        organizationName: userDetails?.organization?.name,
        organizationId: userDetails?.organization?._id,
      },
    });
  }
}

module.exports = new UserController();
