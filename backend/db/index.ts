import { SQLDatabase } from "encore.dev/storage/sqldb";

export default new SQLDatabase("db4", {
  migrations: "./migrations",
});
