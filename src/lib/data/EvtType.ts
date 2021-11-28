import type { IDataOption } from "./IDataOption";

export enum EvtType {
    Inconnu = 0,
    Absence = 1,
    Retard = 2,
    Comportement = 3,
    Discipline = 4,
    Autre = 5,
    InfoEvent = 6,
} // enum EvtType
//
export function GetEvtTypeOptions(): IDataOption[] {
    const options: IDataOption[] = [
        { value: '',name: 'Indetermine' },
        { value: '1',name: 'Absence' },
        { value: '2',name: 'Retard' },
        { value: '3',name: 'Comportement' },
        { value: '4',name: 'Discipline' },
        { value: '5',name: 'Autre' },
        { value: '6',name: 'InfoEvent' },
    ];
    return options;
} // get_evttype_options
export function EvtType2String(etype: EvtType | null | undefined): string {
    if (etype !== undefined) {
        switch (etype) {
            case EvtType.Absence:
                return '1';
            case EvtType.Retard:
                return '2';
            case EvtType.Comportement:
                return '3';
            case EvtType.Discipline:
                return '4';
            case EvtType.Autre:
                return '5';
            case EvtType.InfoEvent:
                return '6';
        } // etype
    }
    return "0";
} // evttype_to_string
export function String2EvtType(s: string | null | undefined): EvtType {
    let etype: EvtType = EvtType.Inconnu;
    if (s !== undefined && s !== null) {
        const ss = s.trim();
        switch (ss) {
            case '1':
                etype = EvtType.Absence;
                break;
            case '2':
                etype = EvtType.Retard;
                break;
            case '3':
                etype = EvtType.Comportement;
                break;
            case '4':
                etype = EvtType.Discipline;
                break;
            case '5':
                etype = EvtType.Autre;
                break;
            case '6':
                etype = EvtType.InfoEvent;
                break;
            default:
                break;
        } // s
    } //
    return etype;
} // string_to_evttype
export function ConvertEvtTypeToString(etype: EvtType | null | undefined): string {
    let stype = 'Indetermine';
    if (etype !== undefined && etype !== null) {
        switch (etype) {
            case EvtType.Absence:
                stype = 'Absence';
                break;
            case EvtType.Autre:
                stype = 'Autre';
                break;
            case EvtType.Comportement:
                stype = 'Comportement';
                break;
            case EvtType.Discipline:
                stype = 'Discipline';
                break;
            case EvtType.Retard:
                stype = 'Retard';
                break;
            case EvtType.InfoEvent:
                stype = "InfoEvent";
                break;
            default:
                break;
        } // etype
    } // etype
    return stype;
} // ConvertEvtTypeToString
export function ConvertStringToEvtType(s: string | null | undefined): EvtType {
    let etype: EvtType = EvtType.Inconnu;
    if (s !== undefined && s !== null) {
        const ss = s.trim();
        switch (ss) {
            case 'Absence':
                etype = EvtType.Absence;
                break;
            case 'Retard':
                etype = EvtType.Retard;
                break;
            case 'Comportement':
                etype = EvtType.Comportement;
                break;
            case 'Discipline':
                etype = EvtType.Discipline;
                break;
            case 'Autre':
                etype = EvtType.Autre;
                break;
            case 'InfoEvent':
                etype = EvtType.InfoEvent;
                break;
            default:
                break;
        } // s
    } //
    return etype;
}// ConvertStringToEvtType
