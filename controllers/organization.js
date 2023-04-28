/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");

class OrganizationController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("Organization");
  }

  async update_organization_details(request) {
    console.log("here");
    const { name, address } = request.body;
    const { organizationId } = request.params;

    console.log({ name, address, organizationId });

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

  async addUserToOrganization() {}
}

module.exports = new OrganizationController();
