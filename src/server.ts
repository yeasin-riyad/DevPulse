import app from "./app"
import config from "./config"
import { initDB } from "./db";


initDB();
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})