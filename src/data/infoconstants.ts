//infoconstants.ts
//
export const EMPTY_STRING: string = '';
//
export const REMOTE_DATABASE_NAME: string = 'http://localhost:5984/geninfo';
export const DATABASE_NAME: string = 'geninfo';
export const REMOTESERVERSLIST_KEY: string = 'remoteservers';
export const DEFAULT_SERVERS:string[]=['http://localhost:5984/geninfo'];
//
export const PERSON_KEY: string = 'person';
export const ETUDIANTPERSON_KEY: string = 'etudperson';
export const ADMINISTRATORPERSON_KEY: string = 'adminperson';
export const ENSEIGNANTPERSON_KEY: string = 'profperson';
export const DEPARTEMENTID_KEY: string = 'departementid';
export const ANNEEID_KEY: string = 'anneeid';
export const SEMESTREID_KEY: string = 'semestreid';
export const UNITEID_KEY: string = 'uniteid';
export const MATIEREID_KEY: string = 'matiereid';
export const GROUPEID_KEY: string = 'groupeid';
export const ENSEIGNANTID_KEY: string = 'enseignantid';
export const ETUDIANTID_KEY: string = 'etudiantid';
//
export const ROLE_SUPER: string = 'super';
export const ROLE_ADMIN: string = 'admin';
export const ROLE_PROF: string = 'prof';
export const ROLE_ETUD: string = 'etud';
export const SUPER_USERNAME: string = 'admin';
export const SUPER_LASTNAME: string = 'SYSTEM';
export const SUPER_FIRSTNAME: string = 'Administrator';
//
export const ATTACHEDDOC_TYPE:string = "attacheddoc";
export const ATTACHEDDOC_PREFIX:string = "ZZ";
export const ANNEE_TYPE: string = 'annee';
export const ANNEE_PREFIX: string = 'ANN';
export const DEPARTEMENT_TYPE: string = 'departement';
export const DEPARTEMENT_PREFIX: string = 'DP';
export const ENSEIGNANT_TYPE: string = 'enseignant';
export const ENSEIGNANT_PREFIX: string = 'PF';
export const ETUDAFFECTATION_TYPE: string = 'etudaffectation';
export const ETUDAFFECTATION_PREFIX: string = 'ET';
export const ETUDEVENT_TYPE: string = 'etudevent';
export const ETUDEVENT_PREFIX: string = 'EV';
export const ETUDIANT_TYPE: string = 'etudiant';
export const ETUDIANT_PREFIX: string = 'ED';
export const GROUPE_TYPE: string = 'groupe';
export const GROUPE_PREFIX: string = 'GP';
export const MATIERE_TYPE: string = 'matiere';
export const MATIERE_PREFIX: string = 'MT';
export const PERSON_PREFIX: string = 'PR';
export const PERSON_TYPE = PERSON_KEY;
export const ETUDIANTPERSON_TYPE = ETUDIANTPERSON_KEY;
export const ADMINISTRATORPERSON_TYPE = ADMINISTRATORPERSON_KEY;
export const ENSEIGNANTPERSON_TYPE = ENSEIGNANTPERSON_KEY;
export const PROFAFFECTATION_TYPE: string = 'profaffectation';
export const PROFAFFECTATION_PREFIX: string = 'AF';
export const SEMESTRE_TYPE: string = 'semestre';
export const SEMESTRE_PREFIX: string = 'SM';
export const UNITE_TYPE: string = 'unite';
export const UNITE_PREFIX: string = 'UT';
export const GROUPEEVENT_TYPE: string = 'groupeevent';
export const GROUPEEVENT_PREFIX: string = 'GV';
export const ADMINISTRATOR_TYPE: string = 'administrator';
export const ADMINISTRATOR_PREFIX: string = 'ADM';
export const GENRE_TP:string = "TP";
export const GENRE_TD:string = "TD";
export const GENRE_PROMO:string = "PROMO";
//
export const GVT_EXAM:string = "EXAMEN";
export const GVT_CONTROL:string = "CONTROL";
export const GVT_TP:string = "TP";
export const GVT_TD:string = "TD";
export const GVT_PROMO:string = "AMPHI";
export const GVT_MISC:string = "MSC";
//
export const EVT_NOTE:string = "NOT";
export const EVT_ABSENCE:string = "ABS";
export const EVT_RETARD:string = "RET";
export const EVT_MISC:string = "MSC";
//
export const HOME_ROUTE:string = 'home';
export const ADMIN_ROUTE:string = 'admin';
export const CONSULT_ROUTE:string = 'consult';
export const ETUDDETAIL_ROUTE:string='etud';
export const GRPEVTDETAIL_ROUTE:string='grpevt';
export const ETUDEVTDETAIL_ROUTE:string='etudevt';
export const ETUDNOTES_ROUTE:string='etudnotes';
export const ATTACHEDDOC_ROUTE:string='attacheddoc';
//
export const PROP_ID:string = "_id";
export const PROP_REV:string = "_rev";
export const PROP_ATTACHMENTS:string = "_attachments";
export const PROP_TYPE:string = "type";
export const PROP_DELETED:string = "_deleted";
//
export const CREATED_STRING:string = 'created';
export const EXISTS_STRING:string = 'exists';
export const LASTCHAR_STRING:string = "\uffff";
//
export const ERR_NULL_DATABASE_NAME:string = "Null Database name";
export const ERR_DATABASE_BUSY:string = "Database is busy";
export const ERR_NULL_DATABASE_HANDLE:string = "Null Database handle";
export const ERR_DOCUMENT_INVALID:string = "Invalid document";
export const ERR_DOCUMENT_ID:string = "Invalid Document ID";
export const ERR_ARGUMENTS_INVALID:string = "Invalid argument(s)";
export const ERR_DATASERVICE_INVALID:string = "Invalid DataService";
export const ERR_UNKNOWN:string = "Erreur inconue";
//
export const START_PAGE:string = "index.html";
export const IMAGES_ROOT:string = "images/";
