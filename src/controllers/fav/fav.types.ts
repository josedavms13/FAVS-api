export interface BulkCreateFavRequirements {
   favListId?: number,
   favListName: string,
   userId: number,
   favs: Fav[]
}

interface Fav {
   title: string,
   description: string,
   link: string,
}

export interface BulkCreateFavRequest {
   favs: Fav[];
   userId: number,
}
