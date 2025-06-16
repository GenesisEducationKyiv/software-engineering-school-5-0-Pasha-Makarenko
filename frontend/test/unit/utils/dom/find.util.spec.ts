import { findParentById } from "../../../../src/app/utils/dom/find.util"

describe("findParentById", () => {
  let grandparent: HTMLElement
  let parent: HTMLElement
  let child: HTMLElement
  let grandchild: HTMLElement

  beforeEach(() => {
    grandparent = document.createElement("div")
    grandparent.id = "grandparent"

    parent = document.createElement("div")
    parent.id = "parent"

    child = document.createElement("div")
    child.id = "child"

    grandchild = document.createElement("div")
    grandchild.id = "grandchild"

    child.appendChild(grandchild)
    parent.appendChild(child)
    grandparent.appendChild(parent)
  })

  it("should find the immediate parent when it matches", () => {
    const result = findParentById(grandchild, ["child"])
    expect(result).toBe(child)
  })

  it("should find a higher-level parent when it matches", () => {
    const result = findParentById(grandchild, ["parent"])
    expect(result).toBe(parent)
  })

  it("should return the first matching parent in the idList", () => {
    const result = findParentById(grandchild, ["parent", "child"])
    expect(result).toBe(child)
  })

  it("should return null when no parent matches", () => {
    const result = findParentById(grandchild, ["non-existent"])
    expect(result).toBeNull()
  })

  it("should return null when element has no parent", () => {
    const orphan = document.createElement("div")
    const result = findParentById(orphan, ["any-id"])
    expect(result).toBeNull()
  })

  it("should work with multiple potential IDs", () => {
    const result = findParentById(grandchild, ["other-id", "child", "parent"])
    expect(result).toBe(child)
  })
})
