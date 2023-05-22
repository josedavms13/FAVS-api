import {
   Column,
   DataType,
   HasMany,
   Model,
   Table,
} from "sequelize-typescript/dist";
import {Fav} from "./Fav";

@Table
export class FavList extends Model<FavList, FavListAttributes> {
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare userId: number;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   declare name: string;

   @HasMany(() => Fav, {
      foreignKey: "favListId",
   })
   declare favLists: Fav[];
}

export interface FavListAttributes {
   name: string;
   userId: number;
}
