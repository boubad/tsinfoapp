//
export type ICouchDBUpdateResponse = {
    readonly id?: string;
    readonly rev?: string;
    readonly ok?: boolean;
    readonly error?: string;
    readonly reason?: string;
};
