import { Injectable } from "@angular/core";
import { StorageService } from "../natives/storage.service";
import { PAGE_NAMES, STORAGE } from "../../app/app.enums";
import { VisitService } from "../visit/visit.service";

interface StateHistoryModel {
  page: string;
  params: any;
}

@Injectable()
export class StateReformingService {

  constructor(public storageService: StorageService, private visitService: VisitService) {
  }

  saveNavStack(nav) {
    if (this.visitService.caching == 'true') {
      let stateHistory: StateHistoryModel[] = [];
      for (let i = 0; i < nav.length(); i++) {
        const view = nav.getByIndex(i);
        if (view.name == PAGE_NAMES.TEST_TYPES_LIST_PAGE) continue;
        if (view.name == PAGE_NAMES.COMPLETE_TEST_PAGE) continue;
        if (view.name == PAGE_NAMES.TEST_REVIEW_PAGE) continue;
        if (view.name == PAGE_NAMES.SIGNATURE_PAD_PAGE) continue;
        stateHistory.push({
          page: view.name,
          params: view.data
        });
      }
      let stateJSON = JSON.stringify(stateHistory);
      this.storageService.update(STORAGE.STATE, stateJSON);
    }
  }

  onTestReview() {
    this.storageService.read(STORAGE.STATE).then(
      (data:string) => {
        let stateHistory: StateHistoryModel[] = JSON.parse(data);
        for (let i = stateHistory.length - 1; i > 0; i--) {
          if (stateHistory[i].page == PAGE_NAMES.VISIT_TIMELINE_PAGE) break;
          stateHistory.pop();
        }
        let stateJSON = JSON.stringify(stateHistory);
        this.storageService.update(STORAGE.STATE, stateJSON);
      }
    )
  }
}
