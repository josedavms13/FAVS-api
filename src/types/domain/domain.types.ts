export type tDBResult = DBSuccess | DBFailure;


interface DBSuccess {
   success: true;
   dbData: any;
}

interface DBFailure {
   success: false,
   reason: any,
   message?: string,
}
