import express from "express";
import AddressRepository from "./addresses.repository";
import AddressesService from "./addresses.service";
import AddressesController from "./addresses.controller";
import { validateReqBody } from "../../common/middleware/validate-req-body.middleware";
import { createAddressSchema } from "./addresses.validation";

const router = express.Router();

const addressesRepository = new AddressRepository();
const addressesService = new AddressesService(addressesRepository);
const addressesController = new AddressesController(addressesService);

const { create } = addressesController;

router.post("/", validateReqBody(createAddressSchema), create);

export default router;
