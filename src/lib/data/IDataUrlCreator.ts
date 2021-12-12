export interface IDataUrlCreator {
    createUrl(data: Blob | ArrayBuffer, mime:string): string | undefined;
}// interface IDataUrlCreator
