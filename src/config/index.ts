import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
//   connection_string: process.env.POSTGRESQL_CONNECTION_STRING as string,
  port: process.env.PORT as string,
//   secret: process.env.JWT_ACCESS_SECRET as string,
//   refresh_secret: process.env.JWT_REFRESH_SECRET as string,
//   node_env: process.env.NODE_ENV as string,
};

export default config;