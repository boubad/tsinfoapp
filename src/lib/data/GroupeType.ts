// GroupeType.ts

import type { IDataOption } from "./IDataOption";

//
export enum GroupeType {
    Unknown = 0,
    Tp = 1,
    Td = 2,
    Promotion = 3,
} // enum GroupeType
//
export function GetGroupeTypeOptions(): IDataOption[] {
    const options: IDataOption[] = [
        { value: '0', name: 'Inconnu' },
        { value: '1', name: 'Tp' },
        { value: '2', name: 'Td' },
        { value: '3', name: 'Promotion' },
    ];
    return options;
} // get_groupetype_options
//
export function GroupeType2String(etype: GroupeType | null | undefined): string {
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case GroupeType.Unknown:
                return '0';
            case GroupeType.Tp:
                return '1';
            case GroupeType.Td:
                return '2';
            case GroupeType.Promotion:
                return '3';
        } // etype
    }
    return '0';
} // groupetype_to_string
export function String2GroupeType(s: string | null | undefined): GroupeType {
    let etype: GroupeType = GroupeType.Unknown;
    if (s !== undefined && s !== null) {
        const ss = s.trim();
        switch (ss) {
            case '1':
                etype = GroupeType.Tp;
                break;
            case '2':
                etype = GroupeType.Td;
                break;
            case '3':
                etype = GroupeType.Promotion;
                break;
            default:
                break;
        } // s
    } // ok
    return etype;
} // string_to_groupetype
export function ConvertGroupeTypeToString(etype: GroupeType | null | undefined): string {
    let stype = 'Indetermine';
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case GroupeType.Tp:
                stype = 'Tp';
                break;
            case GroupeType.Td:
                stype = 'Td';
                break;
            case GroupeType.Promotion:
                stype = 'Promotion';
                break;
            default:
                break;
        } // etype
    } // etype
    return stype;
} // ConvertGroupeTypeToString(
