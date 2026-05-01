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

  login = async (req: any, res: any) => {
    const { email, password } = req.body;
    const tokens = await this.authService.loginUser(email, password);
    this.ok(res, tokens, "User logged in successfully");
  };
}
