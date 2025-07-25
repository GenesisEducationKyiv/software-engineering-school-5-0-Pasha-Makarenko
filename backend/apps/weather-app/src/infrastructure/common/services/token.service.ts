import { Injectable } from "@nestjs/common"
import { randomBytes } from "crypto"
import { ITokenService } from "../../../application/common/interfaces/token-service.interface"

@Injectable()
export class TokenService implements ITokenService {
  generate() {
    return randomBytes(32).toString("hex")
  }
}
