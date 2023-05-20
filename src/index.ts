import "dotenv/config";
import express, {} from "express";
import cors from "cors";
import {getLogger} from "./helpers/logger";
import {doDBConnection} from "./DB";
import bodyParser from "body-parser";
import routes from "./routes";
import {Environments} from "./DB/config/enums";
import {getEnvironment} from "./DB/config/dbConfig";


const logger = getLogger("INDEX");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/api", routes);

const port = Number(process.env.PORT);
const isReset = process.argv[2] === "--reset";
export const isTest = process.argv[2] === "--test";

const RESET_DB_ON_START = false;


(async function() {
   if (isReset && getEnvironment() === Environments.development) {
      await doDBConnection(true);
      logger.log("Database connection reset.");
   } else {
      let successfulConnection = false;
      try {
         successfulConnection = await doDBConnection(RESET_DB_ON_START);
      } catch (e) {
         logger.error("Couldn't connect to DB'");
         logger.error(e);
      }
      if (successfulConnection) {
         app.listen(port, () => {
            logger.log("Listening on port " + port);
         });
      }
   }
})();
