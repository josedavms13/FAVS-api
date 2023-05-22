import {Response} from "express";
import {getLogger} from "../../helpers/logger";
import {bulkCreateFav, createFav} from "./Domain/create.fav";
import {FavAttributes} from "../../DB/models/Fav";
import {validateRequest} from "../../utilities/requestValidation";
import {BulkCreateFavRequest, BulkCreateFavRequirements} from "./fav.types";


const logger = getLogger("FAV | CONTROLLER");

export async function createFavControl(req: any, res: Response) {
   const {
      title,
      description,
      link,
      favListId,
   } = req.body as FavAttributes;
   logger.log("Creating fav list by controller");
   const validated = validateRequest({
      title, description, link, favListId,
   });
   if (!validated.valid) {
      logger.warn("Missing parameters");
      res.status(400).json({
         message: "There are non provided parameters",
         missing: validated.undefinedList,
      });
      return;
   }
   const creationResult = await createFav({
      title, description, link, favListId,
   });
   if (creationResult.success) {
      res.status(201).json(creationResult.dbData);
   } else {
      res.status(500).json(creationResult.reason);
   }
}

export async function createBulkFav(req: any, res: Response) {
   logger.log("Creating bulk fav by controller");
   try {
      const {favs, userId} = req.body as BulkCreateFavRequest;
      if (!userId || !favs || favs.length <= 0) {
         res.status(400).json({
            message: "userId and favs are required",
         });
         return;
      }
      const valid = favs.map((fav) => {
         return validateRequest(fav);
      });
      const failedFav = valid.filter((validation) => !validation.valid);
      if (failedFav.length > 0) {
         res.status(400).json({
            message: "There are undefined fields in some fav objects",
            data: failedFav,
         });
         return;
      }
      const bulkCreate: BulkCreateFavRequirements = {
         favs,
         userId,
      };
      const bulkCreatedFavs = await bulkCreateFav(bulkCreate);
      if (bulkCreatedFavs.success) {
         res.status(201).json(bulkCreatedFavs.dbData);
         return;
      }
      res.status(500).json(bulkCreatedFavs.reason);
   } catch (e) {
      logger.error(e);
      res.status(500).json(e);
   }
}
