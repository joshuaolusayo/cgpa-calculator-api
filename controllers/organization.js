/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/
const SuperController = require("./_super");
const { app_logger } = require("../utilities/logger");
const logger = app_logger("ContactController");

class OrganizationController extends SuperController {
  constructor() {
    super();
    this.Model = this.get_model("Organization");
  }

  async updateOrganizationDetails(conditions, data_to_set) {
    try {
      const result = await this.Model.updateOne(
        { ...conditions },
        {
          $set: { name: data_to_set.name, address: data_to_set.address },
          $currentDate: { updated_on: true },
        }
      );

      return this.jsonize(result);
    } catch (e) {
      logger.console(e.message, "update_records");
    }
  }

  async createUser(name, email) {
    try {
      const existingUser = await this.Model.findOne();

      return this.jsonize(result);
    } catch (e) {
      logger.console(e.message, "update_records");
    }
  }

  async addUserToOrganization() {}
}

module.exports = new OrganizationController();
