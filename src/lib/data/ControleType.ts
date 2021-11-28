// ControleType.ts

import type { IDataOption } from "./IDataOption";

//
export enum ControleType {
    Unknown = 0,
    Tp = 1,
    Td = 2,
    Cours = 3,
    Ds = 4,
    Examen = 5,
    Devoir = 6,
    Other = 7,
} // enum ControleType
//
export function GetControleTypeOptions(): IDataOption[] {
    const options: IDataOption[] = [
        { value: '', name: 'Inconnu' },
        { value: '0', name: 'Inconnu' },
        { value: '1', name: 'Tp' },
        { value: '2', name: 'Td' },
        { value: '3', name: 'Cours' },
        { value: '4', name: 'Ds' },
        { value: '5', name: 'Examen' },
        { value: '6', name: 'Devoir' },
        { value: '7', name: 'Autre' },
    ];
    return options;
} //get_controletype_options
//
export function ControleType2String(etype: ControleType | null | undefined): string {
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case ControleType.Unknown:
                return '0';
            case ControleType.Tp:
                return '1';
            case ControleType.Td:
                return '2';
            case ControleType.Cours:
                return '3';
            case ControleType.Ds:
                return '4';
            case ControleType.Examen:
                return '5';
            case ControleType.Devoir:
                return '6';
            case ControleType.Other:
                return '7';
        } // etype
    }
    return "0";
} //controletype_to_string
export function String2ControleType(s: string | null | undefined): ControleType {
    let etype: ControleType = ControleType.Unknown;
    if (s !== undefined && s !== null) {
        const ss = s.trim();
        switch (ss) {
            case '1':
                etype = ControleType.Tp;
                break;
            case '2':
                etype = ControleType.Td;
                break;
            case '3':
                etype = ControleType.Cours;
                break;
            case '4':
                etype = ControleType.Ds;
                break;
            case '5':
                etype = ControleType.Examen;
                break;
            case '6':
                etype = ControleType.Devoir;
                break;
            case '7':
                etype = ControleType.Other;
                break;
            default:
                break;
        } // s
    } // ok
    return etype;
} // string_to_controletype
export function ConvertControleTypeToString(etype: ControleType | null | undefined): string {
    let stype = 'Indetermine';
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case ControleType.Tp:
                stype = 'Tp';
                break;
            case ControleType.Td:
                stype = 'Td';
                break;
            case ControleType.Cours:
                stype = 'Cours';
                break;
            case ControleType.Ds:
                stype = 'Ds';
                break;
            case ControleType.Examen:
                stype = 'Examen';
                break;
            case ControleType.Devoir:
                stype = 'Devoir';
                break;
            case ControleType.Other:
                stype = 'Autre';
                break;
            default:
                break;
        } // etype
    } // etype
    return stype;
} // ConvertControleTypeToString(
