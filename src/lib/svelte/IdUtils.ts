
export class IdUtils {
    private static _nbcur: number = 0;
    public static CreateID(prefix?: string): string {
        IdUtils._nbcur = IdUtils._nbcur + 1;
        const n = IdUtils._nbcur;
        return (prefix) ? prefix + n : "id_" + n;
    }//CreateID
} // class IdUtils
