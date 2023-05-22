import {tDBResult} from "../../../types/domain/domain.types";
import {getLogger} from "../../../helpers/logger";
import {User, UserAttributes} from "../../../DB/models/User";


const logger = getLogger("USERS | DOMAIN | CREATE");

export async function createUser(data: UserAttributes)
   : Promise<tDBResult> {
   try {
      logger.log("Creating user");
      const createdUser = await User.create(data);
      logger.success("User created successfully");
      return {
         success: true,
         dbData: createdUser,
      };
   } catch (e: any) {
      if (e?.parent?.code === "23505") {
         logger.warn(
            "An user tried to create a new account with existing email");
      }
      logger.error(e);
      return {
         success: false,
         reason: e,
         message: "User couldn't be created",
      };
   }
}
