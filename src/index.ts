import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const PORT = env.port || 8081;

app.listen(PORT, () => {
  logger.info(`🚀 Server started on http://localhost:${PORT}`);
});
