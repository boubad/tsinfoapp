import type { IDataOption } from "./IDataOption";

export function SortOptionsFunc(a: IDataOption, b: IDataOption): number {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    if (a.subTitle && b.subTitle) {
      if (a.subTitle < b.subTitle) {
        return -1;
      } else if (a.subTitle > b.subTitle) {
        return 1;
      }
    }
    return 0;
  } // sort_options_func
  