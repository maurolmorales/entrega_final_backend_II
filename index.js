import { httpServer } from "./src/app.js";
import { configGral } from "./src/config/configGral.js";
const PORT = configGral.PORT;

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando el http://localhost:${PORT}`);
});