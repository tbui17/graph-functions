import { describe, expect, expectTypeOf, it } from "vitest"
import { TestGraph1 } from "./testUtils/testGraph"
import { mapFilterNodes } from ".."

describe("mapFilterEdges", () => {
	it("basic functionality test", () => {
		const g = new TestGraph1()
		g.addNode("a", { type: "a", propA: "a" })
		g.addNode("a2", { type: "a", propA: "a2" })
		g.addNode("b", { type: "b", propB: "b" })

		const node = mapFilterNodes(g, (node, attr) => {
			if (attr.type === "a") {
				return attr
			}
		})
		expect(node).toEqual([
			{ type: "a", propA: "a" },
			{ type: "a", propA: "a2" },
		])
		expectTypeOf(node).toEqualTypeOf<{ type: "a"; propA: string }[]>()
	})
})
