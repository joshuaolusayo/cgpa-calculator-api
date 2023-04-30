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

  async update_organization_details(request) {
    // console.log(request);
    console.log("here");
    const { name, address } = request.body;
    const { organizationId } = request.params;

    console.log({ name, address, organizationId });
    console.log(request.user);
    await this.verify_organization_admin(organizationId, request.user);

    console.log("sss");
    const updateOrganization = await this.update_data(
      "Organization",
      {
        _id: organizationId,
      },
      { name, address }
    );

    return this.process_successful_response({
      message: "Successfully updated organization details",
      organization: updateOrganization,
    });
  }

  async addUserToOrganization(request) {
    // console.log()
    const { organizationId } = request.params;
    const { name, email, password } = request.body;

    if (!organizationId || !name || !email || !password)
      return this.process_failed_response("Bad request");

    const organization = await this.verify_organization_admin(
      organizationId,
      request.user
    );

    // const organization = await this.Model.findById(organizationId);
    // if (!organizationId)
    //   return this.process_failed_response(
    //     "Organization with that id not found"
    //   );

    // if (organization.admin.toString() !== request.user.organization.toString())
    //   return this.process_failed_response("Unauthorized", 403);

    const existingUser = await this.check_if_exists("User", { email });

    if (existingUser) {
      return this.process_failed_response(
        "User with that email already exists",
        400
      );
    }

    const user = await this.Model.create({
      name,
      email,
      password,
      role: "organization_staff",
      organization: organization._id,
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
      return this.process_failed_response(
        "Organization with that id not found"
      );

    if (organization.admin.toString() !== currentUser.organization.toString())
      return this.process_failed_response("Unauthorized", 403);

    return organization;
  }
}

module.exports = new OrganizationController();
