import "tsarch/dist/jest"
import { filesOfProject } from "tsarch"

enum LayersFolders {
  DOMAIN = "src/domain",
  APPLICATION = "src/application",
  INFRASTRUCTURE = "src/infrastructure",
  PRESENTATION = "src/presentation"
}

describe("architecture", () => {
  jest.setTimeout(60000)

  it("domain layer should be isolated", () => {
    const rule = filesOfProject()
      .inFolder(LayersFolders.DOMAIN)
      .should()
      .beFreeOfCycles()

    expect(rule).toPassAsync()
  })

  it("infrastructure layer should not depend on application", () => {
    const rule = filesOfProject()
      .inFolder(LayersFolders.INFRASTRUCTURE)
      .shouldNot()
      .dependOnFiles()
      .inFolder(LayersFolders.APPLICATION)

    expect(rule).toPassAsync()
  })

  it("infrastructure layer should not depend on presentation", () => {
    const rule = filesOfProject()
      .inFolder(LayersFolders.INFRASTRUCTURE)
      .shouldNot()
      .dependOnFiles()
      .inFolder(LayersFolders.PRESENTATION)

    expect(rule).toPassAsync()
  })

  it("application layer should not depend on presentation", () => {
    const rule = filesOfProject()
      .inFolder(LayersFolders.APPLICATION)
      .shouldNot()
      .dependOnFiles()
      .inFolder(LayersFolders.PRESENTATION)

    expect(rule).toPassAsync()
  })
})
