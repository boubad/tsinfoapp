// InfoDomain.ts
export interface IItemDoc {
    _id?: string
    _rev?: string
    _deleted?: boolean
    _attachments?: Record<string, unknown>
    doctype?: string
    status?: number
    tag?: string
    observations?: string
    ownerid?: string
    reptype?: string
  } // interface IItemDoc
  export interface IItemSigleNamed extends IItemDoc {
    sigle?: string
    name?: string
  } // interface
  export interface IItemGroupe extends IItemSigleNamed {
    semestreid?: string
    parentid?: string
    groupetype?: number
  } // interface IItemGroupe
  export type IItemSemestre = IItemSigleNamed // interface IItemSemestre
  export type IItemUnite = IItemSigleNamed // interface IItemUnite
  export interface IItemAnnee extends IItemSigleNamed {
    startdate?: string
    enddate?: string
  } // interface IItemAnnee
  export interface IItemMatiere extends IItemSigleNamed {
    uniteid?: string
    modname?: string
    coefficient?: number
    ecs?: number
  } // interface IItemMatiere
  export interface IItemPerson extends IItemDoc {
    username?: string
    password?: string
    firstname?: string
    lastname?: string
    email?: string
    phone?: string
    birthdate?: string
    sexe?: string
    roles?: string[]
    avatar?: string
    address?: string
  } // interface IItemPerson
  export interface IItemEtudiant extends IItemPerson {
    birthyear?: number
    ident?: string
    departement?: string
    ville?: string
    etablissement?: string
    seriebac?: string
    optionbac?: string
    mentionbac?: string
    apb?: number
    sup?: string
    redoublant?: string
    typeformation?: string
    notedirty?: boolean
    evtdirty?: boolean
    data?: Record<string, unknown>
    s0?: Record<string, unknown>
    s1?: Record<string, unknown>
    s2?: Record<string, unknown>
    s3?: Record<string, unknown>
    s4?: Record<string, unknown>
    s5?: Record<string, unknown>
    s6?: Record<string, unknown>
  } // interface IItemEtudiant
  export interface IItemControle extends IItemDoc {
    groupecontroleid?: string
    anneeid?: string
    groupeid?: string
    date?: string
    place?: string
  } // interface IItemControle
  export interface IItemGroupeControles extends IItemSigleNamed {
    semestreid?: string
    matiereid?: string
    coefficient?: number
    controletype?: number
    duration?: string
    hasnotes?: boolean
  } // interface IItemGroupeControles
  export interface IItemEtudAffectation extends IItemDoc {
    groupeid?: string
    anneeid?: string
    etudiantid?: string
    startdate?: string
    enddate?: string
  } // interface IItemEtudAffectation
  export interface IItemControleChild extends IItemDoc {
    controleid?: string
    etudiantid?: string
  } // interface IItemControleChild
  export interface IItemEvt extends IItemControleChild {
    evttype?: number
    justifie?: boolean
    duration?: string
  } // interface IItemEvt
  export interface IItemNote extends IItemControleChild {
    value?: number
  } // interface IItemNote
  