import {tDBResult} from "../../../types/domain/domain.types";
import {Fav, FavAttributes} from "../../../DB/models/Fav";
import {getLogger} from "../../../helpers/logger";
import {BulkCreateFavRequirements} from "../fav.types";
import {createFavList} from "../../favList/Domain/create.favList";
import {getUser} from "../../user/Domain/get.user";


const logger = getLogger("FAV | DOMAIN | CREATE");

export async function createFav(data: FavAttributes): Promise<tDBResult> {
   logger.log("Creating new Fav");
   try {
      const createdFav = await Fav.create(data);
      logger.success("Fav created successfully");
      return {
         success: true,
         dbData: createdFav,
      };
   } catch (e) {
      logger.error(e);
      return {
         success: false,
         reason: e,
      };
   }
}

/**
 * Create many favs with the data provided.
 * - If favListId is provided:
 * Will assign all created favs to that favList
 * - If not:
 * Will create a new favList to be assigned to all created Favs
 * @param {Fav[]} favs
 * @param {number?} favListId
 * @param {number} userId
 */
export async function bulkCreateFav({
   favs,
   favListId,
   userId,
}: BulkCreateFavRequirements)
   : Promise<tDBResult> {
   logger.log("Creating bulk Favs");
   if (!favs || !userId) {
      logger.error("No required parameters were provided");
      return {
         success: false,
         reason: "No required parameters were provided",
      };
   }
   try {
      const {success} = await getUser(userId);
      if (!success) {
         logger.warn(`User ${ userId } does not exist`);
         return {
            success: false,
            reason: `User ${ userId } does not exist`,
         };
      }
      let favListFinalId: number;
      if (!favListId) {
         const favListCreated = await createFavList({
            userId: userId,
         });
         if (!favListCreated.success) {
            logger.error("Fav creation failed");
            logger.error(favListCreated.reason);
            return {
               success: false,
               message: "Fav creation failed",
               reason: favListCreated.reason,
            };
         }
         favListFinalId = favListCreated.dbData.id;
      } else {
         favListFinalId = favListId;
      }
      const bulkData: FavAttributes[] = favs.map((fav) => {
         return {
            title: fav.title,
            favListId: favListFinalId,
            link: fav.link,
            description: fav.description,
         };
      });
      const createdFavs = await Fav.bulkCreate(bulkData);
      logger.success("FAVS created successfully");
      return {
         success: true,
         dbData: createdFavs,
      };
   } catch (e) {
      logger.error(e);
      return {
         success: false,
         reason: e,
      };
   }
}
