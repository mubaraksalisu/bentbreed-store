import prisma from "../../infrastructure/database/prisma";
import { CreateAddressDto } from "./addresses.types";

export default class AddressRepository {
  create(data: CreateAddressDto) {
    return prisma.address.create({
      data,
    });
  }
}
