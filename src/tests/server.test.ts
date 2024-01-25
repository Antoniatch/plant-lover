import assert from "assert";

describe("Start server", () => {
    it("starts correctly server", () => {
        expect(globalThis.url).toBe("http://localhost:4001/");
    });

    it("can query", async () => {
        const response = await globalThis.testServer.executeOperation({
            query: "query {testQuery}",
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.testQuery).toBe(true);
    });
});
