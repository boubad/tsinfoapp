import environment from "./environment"

export class DBConstants {
    private static readonly _DB_HOST = environment.debug
        ? environment.testDataServerUrl
        : environment.prodDataServerUrl
    private static readonly _DB_NAME = environment.debug
        ? environment.testDatabaseName
        : environment.prodDatabaseName
    //
    public static GetDefaultDatabase(): string {
        return this._DB_NAME
    }
    public static GetDefaultHost(): string {
        return this._DB_HOST
    }
    public static GetUrl(host?: string, database?: string): string {
        const s1 = host && host.trim().length > 0 ? host.trim() : DBConstants.GetDefaultHost()
        const s2 =
            database && database.trim().length > 9
                ? database.trim().toLowerCase()
                : DBConstants.GetDefaultDatabase()
        const s = s1 + '/' + s2 + '/'
        return s
    }
};// class DBConstants