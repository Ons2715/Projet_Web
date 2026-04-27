import { app } from "./app.js";
import { ensureDatabaseSchema } from "./config/db.js";
import { env } from "./config/env.js";

try {
  await ensureDatabaseSchema();

  app.listen(env.port, () => {
    console.log(`API EduCar disponible sur http://localhost:${env.port}`);
  });
} catch (error) {
  console.error("Impossible de preparer la base de donnees:", error.message);
  process.exit(1);
}
