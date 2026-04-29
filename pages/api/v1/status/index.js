import database from "infra/database.js";
import { InternalServerError } from "infra/erros";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const dbVersionResult = await database.query("SHOW server_version;");
    const dbVersion = dbVersionResult.rows[0].server_version;

    const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
    const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const dbOpenConnectionsResult = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname=$1;",
      values: [databaseName],
    });
    const dbOpenConnections = dbOpenConnectionsResult.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: parseInt(dbMaxConnections),
          open_connections: dbOpenConnections,
        },
      },
    });
  } catch (err) {
    const publicErrorObject = new InternalServerError({
      cause: err,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.log(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
