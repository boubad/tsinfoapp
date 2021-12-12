// StatusType.ts

import type { IDataOption } from "./IDataOption";

//
export enum StatusType {
    Unknown = 0,
    Persisted = 1,
    Tail = 2,
    Disabled = 3,
    Inserted = 4,
    Updated = 5,
    Deleted = 6,
    Info = 7,
    Normal = 8,
    Active = 9,
    Inactive = 10,
    Busy = 11,
    Closed = 12,
    Done = 13,
    Free = 14,
} // enum StatusType
export function GetStatusTypeOptions(): IDataOption[] {
    const options: IDataOption[] = [
        { value: '', name: '' },
        { value: '0', name: 'Unknown' },
        { value: '1', name: 'Persisted' },
        { value: '2', name: 'Tail' },
        { value: '3', name: 'Disabled' },
        { value: '4', name: 'Inserted' },
        { value: '5', name: 'Updated' },
        { value: '6', name: 'Deleted' },
        { value: '7', name: 'Info' },
        { value: '8', name: 'Normal' },
        { value: '9', name: 'Active' },
        { value: '10', name: 'Inactive' },
        { value: '11', name: 'Busy' },
        { value: '12', name: 'Closed' },
        { value: '13', name: 'Done' },
        { value: '14', name: 'Free' },
    ];
    return options;
} // get_status_options
export function StatusType2String(etype: StatusType | null | undefined): string {
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case StatusType.Unknown:
                return '0';
            case StatusType.Persisted:
                return '1';
            case StatusType.Tail:
                return '2';
            case StatusType.Disabled:
                return '3';
            case StatusType.Inserted:
                return '4';
            case StatusType.Updated:
                return '5';
            case StatusType.Deleted:
                return '6';
            case StatusType.Info:
                return '7';
            case StatusType.Normal:
                return '8';
            case StatusType.Active:
                return '9';
            case StatusType.Inactive:
                return '10';
            case StatusType.Busy:
                return '11';
            case StatusType.Closed:
                return '12';
            case StatusType.Done:
                return '13';
            case StatusType.Free:
                return '14';
        } // etype
    }
    return '0';
} // status_to_string
export function String2StatusType(s: string | null | undefined): StatusType {
    let etype: StatusType = StatusType.Unknown;
    if (s !== undefined && s !== null) {
        const ss = s.trim();
        switch (ss) {
            case '1':
                etype = StatusType.Persisted;
                break;
            case '2':
                etype = StatusType.Tail;
                break;
            case '3':
                etype = StatusType.Disabled;
                break;
            case '4':
                etype = StatusType.Inserted;
                break;
            case '5':
                etype = StatusType.Updated;
                break;
            case '6':
                etype = StatusType.Deleted;
                break;
            case '7':
                etype = StatusType.Info;
                break;
            case '8':
                etype = StatusType.Normal;
                break;
            case '9':
                etype = StatusType.Active;
                break;
            case '10':
                etype = StatusType.Inactive;
                break;
            case '11':
                etype = StatusType.Busy;
                break;
            case '12':
                etype = StatusType.Closed;
                break;
            case '13':
                etype = StatusType.Done;
                break;
            case '14':
                etype = StatusType.Free;
                break;
            default:
                break;
        } // s
    } // ok
    return etype;
} // string_to_status
export function ConvertStatusTypeToString(t: StatusType | null | undefined): string {
    let sRet = 'Unknown';
    if (t !== undefined && t !== null) {
        switch (t) {
            case StatusType.Persisted:
                sRet = 'Persisted';
                break;
            case StatusType.Tail:
                sRet = 'Tail';
                break;
            case StatusType.Disabled:
                sRet = 'Disabled';
                break;
            case StatusType.Inserted:
                sRet = 'Inserted';
                break;
            case StatusType.Updated:
                sRet = 'Updated';
                break;
            case StatusType.Deleted:
                sRet = 'Deleted';
                break;
            case StatusType.Info:
                sRet = 'Info';
                break;
            case StatusType.Normal:
                sRet = 'Normal';
                break;
            case StatusType.Active:
                sRet = 'Active';
                break;
            case StatusType.Inactive:
                sRet = 'Inactive';
                break;
            case StatusType.Busy:
                sRet = 'Busy';
                break;
            case StatusType.Closed:
                sRet = 'Closed';
                break;
            case StatusType.Done:
                sRet = 'Done';
                break;
            case StatusType.Free:
                sRet = 'Free';
                break;
            default:
                break;
        } // t
    } // t
    return sRet;
} // convertStatusTypeToString
