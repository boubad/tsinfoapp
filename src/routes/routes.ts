import type { RouteDefinition } from "svelte-spa-router";
import Home from "../lib/svelte/features/home/Home.svelte";
import NotFound from "../lib/svelte/features/NotFound.svelte";
import Semestres from "../lib/svelte/features/semestre/Semestres.svelte";
import Semestre from "../lib/svelte/features/semestre/Semestre.svelte";
import Annees from "../lib/svelte/features/annee/Annees.svelte";
import Annee from "../lib/svelte/features/annee/Annee.svelte";
import Unites from "../lib/svelte/features/unite/Unites.svelte";
import Unite from "../lib/svelte/features/unite/Unite.svelte";
import Groupes from "../lib/svelte/features/groupe/Groupes.svelte";
import Groupe from "../lib/svelte/features/groupe/Groupe.svelte";
import Matieres from "../lib/svelte/features/matiere/Matieres.svelte";
import Matiere from "../lib/svelte/features/matiere/Matiere.svelte";
import MatiereCreate from "../lib/svelte/features/matiere/MatiereCreate.svelte";
import Note from "../lib/svelte/features/common/Note.svelte";
import Evt from "../lib/svelte/features/common/Evt.svelte";
import ControleEvtCreate from "../lib/svelte/features/controle/ControleEvtCreate.svelte";
import GroupeControles from "../lib/svelte/features/groupecontrole/GroupeControles.svelte";
import GroupeControlesCreate from "../lib/svelte/features/groupecontrole/GroupeControlesCreate.svelte";
import GroupeControle from "../lib/svelte/features/groupecontrole/GroupeControle.svelte";
import EtudiantFilter from "../lib/svelte/features/etudiantfilter/EtudiantFilter.svelte";
import Etudiants from "../lib/svelte/features/etudiant/Etudiants.svelte";
import Etudiant from "../lib/svelte/features/etudiant/Etudiant.svelte";
import EtudAffectations from "../lib/svelte/features/etudaffectation/EtudAffectations.svelte";
import EtudAffectation from "../lib/svelte/features/etudaffectation/EtudAffectation.svelte";
import EtudAffectationsCreate from "../lib/svelte/features/etudaffectation/EtudAffectationsCreate.svelte";
import Controles from "../lib/svelte/features/controle/Controles.svelte";
import Controle from "../lib/svelte/features/controle/Controle.svelte";
import ControleCreate from "../lib/svelte/features/controle/ControleCreate.svelte";
import MatiereStats from "../lib/svelte/features/stat/MatiereStats.svelte";
//
import Test from "../lib/svelte/features/Test.svelte";
//
export const routes: RouteDefinition = {
  "/": Home,
  '/test': Test,
  "/etudiants": Etudiants,
  "/etudiant/:id?": Etudiant,
  "/filter/etudiant": EtudiantFilter,
  "/note/:id": Note,
  "/evt/:id": Evt,
  "/evtcreate/:controle": ControleEvtCreate,
  "/annees": Annees,
  "/annee/:id?": Annee,
  "/semestres": Semestres,
  "/semestre/:id?": Semestre,
  "/unites": Unites,
  "/unite/:id?": Unite,
  "/groupes/:semestre": Groupes,
  "/groupe/:id": Groupe,
  "/groupecreate/:semestre": Groupe,
  "/matieres/:unite": Matieres,
  "/matiere/:id": Matiere,
  "/matierecreate/:unite": MatiereCreate,
  "/groupecontroles/:semestre/:matiere": GroupeControles,
  "/groupecontrole/:id?": GroupeControle,
  "/groupecontrolescreate/:semestre/:matiere": GroupeControlesCreate,
  "/etudaffectations/:annee/:groupe": EtudAffectations,
  "/etudaffectation/:id": EtudAffectation,
  "/etudaffectationscreate/:annee/:groupe": EtudAffectationsCreate,
  '/controles/:annee/:groupe/:semestre?/:matiere?': Controles,
  '/controle/:id?': Controle,
  '/controlecreate/:annee/:semestre/:matiere/:groupe': ControleCreate,
  '/statmatiere/:annee/:semestre/:matiere': MatiereStats,
  // The catch-all route must always be last
  "*": NotFound,
};
