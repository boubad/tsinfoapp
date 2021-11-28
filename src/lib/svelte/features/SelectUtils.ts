import { InfoRouter } from "../../../routes/InfoRouter";
import {
  ROUTE_CONTROLE_DETAIL,
  ROUTE_ETUDIANT_DETAIL,
} from "../../../routes/routesdefs";
export class SelectUtils {
  public static SelectControle(controleid: string): void {
    InfoRouter(ROUTE_CONTROLE_DETAIL + "/" + controleid);
  } // SelectControleAsync
  public static SelectEtudiant(etudiantid: string): void {
    InfoRouter(ROUTE_ETUDIANT_DETAIL + "/" + etudiantid);
  }
} // class SelectUtils
