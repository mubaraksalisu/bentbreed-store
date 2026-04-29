import BaseController from "../../common/controllers/base.controller";
import AddressesService from "./addresses.service";

export default class AddressesController extends BaseController {
  constructor(private addressesService: AddressesService) {
    super();
  }

  create = async (req: any, res: any) => {
    const address = await this.addressesService.create(req.body);
    return this.created(res, address, "Address created successfully");
  };
}
