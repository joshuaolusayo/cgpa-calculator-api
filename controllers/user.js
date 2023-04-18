/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");
const { app_logger } = require("../utilities/logger");
const logger = app_logger("UserController");

class UserController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("User");
  }

  async getAllUsers() {
    const users = await User.find({});
    if (users) {
      return this.process_successful_response(users);
    }
    return this.process_failed_response("Unable to retrieve user details", 500);
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

  //   async updateOrganizationDetails(conditions, data_to_set) {
  //     try {
  //       const result = await this.Model.updateOne(
  //         { ...conditions },
  //         {
  //           $set: { name: data_to_set.name, address: data_to_set.address },
  //           $currentDate: { updated_on: true },
  //         }
  //       );

  //       return this.jsonize(result);
  //     } catch (e) {
  //       logger.console(e.message, "update_records");
  //     }
  //   }

  async addUserToOrganization() {}
}

module.exports = new UserController();
