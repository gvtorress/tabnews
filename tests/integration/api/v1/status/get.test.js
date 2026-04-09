import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
    
      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();
    
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toBe(parsedUpdatedAt);
    
      const dbObject = {
        version: "18.3",
        max_connections: 100,
        open_connections: 1,
      };
    
      expect(responseBody.dependencies.database.version).toBe("18.3");
      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.open_connections).toBe(1);
    
      // teste mais preciso (para não correr risco de adicionar propriedades indesejadas e os testes não pegarem)
      expect(responseBody.dependencies.database).toEqual(dbObject);
    });
  });
});
