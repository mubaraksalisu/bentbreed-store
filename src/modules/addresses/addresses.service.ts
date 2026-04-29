import { Address } from "../../generated/prisma/client";
import AddressRepository from "./addresses.repository";
import { CreateAddressDto } from "./addresses.types";

export default class AddressesService {
  constructor(private addressRepository: AddressRepository) {}

  async create(data: CreateAddressDto): Promise<Address> {
    const address = await this.addressRepository.create(data);
    return address;
  }
}
