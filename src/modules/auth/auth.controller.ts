import BaseController from "../../common/controllers/base.controller";
import AuthService from "./auth.service";

export default class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  register = async (req: any, res: any) => {
    const user = await this.authService.registerUser(req.body);
    this.created(res, user, "User registered successfully");
  };
}
