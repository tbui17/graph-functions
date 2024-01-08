import { expect, it } from "vitest"
import { TestGraph2 } from "./testUtils/testGraph"
import { getNodeComponent } from ".."

const graph = TestGraph2.create()
it("should retrieve nodes in same component", () => {
	const component = getNodeComponent(graph, "table3")
	expect(component).toEqual(
		expect.arrayContaining([
			"table1",
			"table2",
			"table3",
			"table4",
			"table5",
		])
	)
	expect(component).toHaveLength(5)

	const component2 = getNodeComponent(graph, "table6")
	expect(component2).toEqual(expect.arrayContaining(["table6", "table7"]))
})
