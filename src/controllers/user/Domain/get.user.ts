import {getLogger} from "../../../helpers/logger";
import {User} from "../../../DB/models/User";
import {tDBResult} from "../../../types/domain/domain.types";


const logger = getLogger("USER | DOMAIN | GET");

export async function getUser(userId: number): Promise<tDBResult> {
   logger.log(`Verifying if user ${ userId } exists`);
   try {
      const retrievedUser = await User.findOne({
         where: {
            id: userId,
         },
      });
      if (retrievedUser) {
         return {
            success: true,
            dbData: retrievedUser.id,
         };
      } else {
         return {
            success: false,
            reason: "User not found",
         };
      }
   } catch (e) {
      logger.error(e);
      return {
         success: false,
         reason: e,
      };
   }
}
