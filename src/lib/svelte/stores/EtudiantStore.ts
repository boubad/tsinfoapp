import { writable, Writable } from "svelte/store";
import { DomainConstants } from "../../data/DomainConstants";
import type { IPaginationData } from "../../data/IPaginationData";
import { GetInitialPaginationData } from "../../data/PaginationUtils";
import { StatusType } from '../../data/StatusType ';
//
export const etudiantfilterstore: Writable<Record<string,unknown>> = writable({ doctype: DomainConstants.TYPE_ETUDIANT, status:StatusType.Normal });
export const etudiantpaginationstore: Writable<IPaginationData> = writable(GetInitialPaginationData());
//