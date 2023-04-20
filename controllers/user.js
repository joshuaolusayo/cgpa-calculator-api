/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");

const { app_logger } = require("../utilities/logger");
const logger = app_logger("UserController");
const generateToken = require("../utilities/generateToken");

class UserController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("User");
  }

  // done
  async getAllUsers() {
    const users = await this.Model.find({});
    if (users) {
      return this.process_successful_response({ users, total: users.length });
    }
    return this.process_failed_response("Unable to retrieve user details", 500);
  }

  async login(data) {
    const { email, password } = data;
    const user = await this.Model.findOne({ email });
    console.log(user);

    const dd = await this.Model.matchPassword(password);
    console.log(dd);

    if (user && (await this.Model.matchPassword(password))) {
      console.log("here");
      return this.process_successful_response({
        message: "Successfully registered",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      return this.process_failed_response("Invalid email address or password");
    }
  }

  async create_user(userDetails) {
    const { name, email, password } = userDetails;
    try {
      const existingUser = await this.Model.findOne({ email });
      if (existingUser) {
        return this.process_failed_response(
          "User with that email already exists",
          400
        );
      }
      const user = await User.create({
        name,
        email,
        password,
      });
      if (user) {
        const token = await this.create_token(user._id);
        return this.process_successful_response(
          {
            _id: user._id,
            token,
          },
          201
        );
      }
      return this.process_failed_response("Unable to create user", 500);
    } catch (e) {
      logger.console(e.message, "create_user");
    }
  }

  async create_token(_userId) {
    const verificationToken = await Token.create({
      _userId,
      token: crypto.randomBytes(32).toString("hex"),
    });
    return verificationToken.token;
  }

  async addUserToOrganization() {}
}

console.log("testing");

module.exports = new UserController();
