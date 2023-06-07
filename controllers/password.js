/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");
const generateToken = require("../utilities/generateToken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

class UserController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("User");
    this.OrganizationModel = this.get_model("Organization");
    this.TokenModel = this.get_model("Token");
  }

  async send_reset_password_link(request) {
    const {
      body: { email },
    } = request;

    console.log({ email });

    if (!email)
      return this.process_failed_response("Please, provide your email");

    const user = await this.Model.findOne({ email });

    if (!user)
      return this.process_failed_response("User with that email not found");

    if (user.role === "organization_staff")
      return this.process_failed_response(
        "Contact your organization administrator for your password reset"
      );

    let token = await this.TokenModel.findOne({
      _userId: user._id,
      type: "password_reset",
    });

    if (!token) {
      token = await this.TokenModel.create({
        _userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
        type: "password_reset",
      });
    }

    // send email
    return this.process_successful_response({
      message: "Email verification code sent",
      token: token?.token,
    });
  }

  async reset_password(request) {
    const {
      body: { token, password },
    } = request;

    console.log({ token, password });

    if (!token || !password)
      return this.process_failed_response(
        "Please, provide your password and token"
      );

    let findToken = await this.TokenModel.findOne({
      token,
      type: "password_reset",
    });

    if (!findToken)
      return this.process_failed_response("Invalid or expired token");

    const { _userId } = findToken;
    const currentUser = await this.Model.findById(_userId);

    if (!currentUser)
      return this.process_failed_response("User with that token not found");

    const encryptPassword = await this.encrypt_password(password);

    await this.update_data(
      "User",
      { _id: _userId },
      { password: encryptPassword }
    );

    await this.TokenModel.deleteOne({
      _userId,
      type: "password_reset",
    });

    return this.process_successful_response({
      message: "Password updated successfully",
    });
  }

  encrypt_password = async (raw_password) => {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const encrypted_password = await bcrypt.hash(raw_password, salt);
    return encrypted_password;
  };

  async update_password(request) {
    const {
      body: { oldPassword, newPassword },
      user,
    } = request;

    if (!oldPassword || !newPassword)
      return this.process_failed_response(
        "Please, provide your old and new password"
      );

    const currentUser = await this.Model.findById(user._id.toString());

    const checkOldPassword = await currentUser.matchPassword(oldPassword);

    if (!checkOldPassword)
      return this.process_failed_response("Old password does not match");

    const encryptNewPassword = await this.encrypt_password(newPassword);

    await this.update_data(
      "User",
      { _id: user._id },
      { password: encryptNewPassword }
    );

    return this.process_successful_response({
      message: "Password updated successfully",
    });
  }

  async reset_staff_password(request) {
    const {
      body: { userId, email },
      user,
    } = request;

    if (!userId && !email)
      return this.process_failed_response(
        "User id or email of the user must be included"
      );

    const staff = await this.Model.findOne({
      $or: [{ _id: userId }, { email }],
    });

    if (
      user.organization.toString() !== staff.organization.toString() ||
      user.role !== "organization_admin"
    )
      return this.process_failed_response("Unauthorized", 401);

    const encryptNewPassword = await this.encrypt_password("123456");

    await this.update_data(
      "User",
      { _id: staff._id },
      { password: encryptNewPassword }
    );

    return this.process_successful_response({
      message: "Staff password reset successfully",
    });
  }

  encrypt_password = async (raw_password) => {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const encrypted_password = await bcrypt.hash(raw_password, salt);
    return encrypted_password;
  };
}

module.exports = new UserController();
