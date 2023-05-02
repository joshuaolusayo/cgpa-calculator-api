/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");

class OrganizationController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("Organization");
    this.UserModel = this.get_model("User");
  }

  async get_all_organizations() {
    const organizations = await this.Model.find({});
    if (organizations) {
      return this.process_successful_response({
        message: "Successfully fetched all organizations",
        organizations,
        total: organizations.length,
      });
    }
    return this.process_failed_response(
      "Unable to retrieve all organizations",
      500
    );
  }

  async update_organization_details(request) {
    const { name, address } = request.body;
    let { organizationId } = request.params;

    if (organizationId) {
      organizationId = request.user.organization?.toString();
    }

    const { organization, error, status } =
      await this.verify_organization_admin(organizationId, request.user);

    if (error) return this.process_failed_response(error, status);

    await this.update_data(
      "Organization",
      {
        _id: organization._id,
      },
      { name, address }
    );

    return this.process_successful_response({
      message: "Successfully updated organization details",
    });
  }

  async add_user_to_organization(request) {
    const { organization: organizationId } = request.user;
    const { name, email } = request.body;

    if (!organizationId || !name || !email)
      return this.process_failed_response("Bad request");

    const { organization, error, status } =
      await this.verify_organization_admin(organizationId, request.user);

    if (error) return this.process_failed_response(error, status);

    const existingUser = await this.check_if_exists("User", {
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return this.process_failed_response(
        "User with that email already exists",
        400
      );
    }

    const user = await this.UserModel.create({
      name,
      email: email.toLowerCase().trim(),
      password: "123456",
      role: "organization_staff",
      organization: organizationId,
      isVerified: true,
    });

    return this.process_successful_response(
      {
        message: "Staff account created successfully",
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
      },
      201
    );
  }

  async verify_organization_admin(organizationId, currentUser) {
    const organization = await this.Model.findById(organizationId);

    if (!organizationId)
      return { error: "Organization with that id not found" };

    if (organization.admin.toString() !== currentUser._id.toString())
      return { error: "Unauthorized", status: 403 };

    return { organization };
  }
}

module.exports = new OrganizationController();
