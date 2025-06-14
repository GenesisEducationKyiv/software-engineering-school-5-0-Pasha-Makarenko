import { Test, TestingModule } from "@nestjs/testing"
import { UrlGeneratorService } from "./url-generator.service"

describe("UrlGeneratorService", () => {
  let service: UrlGeneratorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlGeneratorService]
    }).compile()

    service = module.get<UrlGeneratorService>(UrlGeneratorService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
