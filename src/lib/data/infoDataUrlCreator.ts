const urlCreator = window.URL || window.webkitURL
export const infoDataUrlCreator = {
  createUrl: (data: Blob | ArrayBuffer, mime: string): string | undefined => {
    if (urlCreator) {
      const blob = new Blob([data], { type: mime })
      return urlCreator.createObjectURL(blob)
    }
    return undefined
  }
} ;
/*
export const infoDataUrlCreator = {
    createUrl: (_data: Blob | ArrayBuffer, _mime: string): string | undefined => {
      return undefined
    }
  } //
  */
