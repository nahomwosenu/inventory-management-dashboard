import { SQLDatabase } from "encore.dev/storage/sqldb";

export default new SQLDatabase("db2", {
  migrations: "./migrations",
});
