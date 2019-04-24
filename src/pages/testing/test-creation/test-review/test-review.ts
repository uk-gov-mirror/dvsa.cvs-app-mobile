import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  ModalController,
  ViewController,
  NavController,
  NavParams, LoadingController
} from 'ionic-angular';
import { VisitModel } from "../../../../models/visit/visit.model";
import { CommonFunctionsService } from "../../../../providers/utils/common-functions";
import {
  APP,
  APP_STRINGS,
  DATE_FORMAT,
  DEFICIENCY_CATEGORY,
  ODOMETER_METRIC, PAGE_NAMES,
  TEST_REPORT_STATUSES,
  TEST_TYPE_INPUTS,
  TEST_TYPE_RESULTS,
  LOCAL_STORAGE
} from "../../../../app/app.enums";
import { VehicleModel } from "../../../../models/vehicle/vehicle.model";
import { VehicleService } from "../../../../providers/vehicle/vehicle.service";
import { CompleteTestPage } from "../complete-test/complete-test";
import { TestTypesFieldsMetadata } from "../../../../assets/app-data/test-types-data/test-types-fields.metadata";
import { TestTypeModel } from "../../../../models/tests/test-type.model";
import { TestModel } from "../../../../models/tests/test.model";
import { TestResultService } from "../../../../providers/test-result/test-result.service";
import { TestService } from "../../../../providers/test/test.service";
import { Observable } from "rxjs";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { VisitService } from "../../../../providers/visit/visit.service";
import { tap } from "rxjs/operators";
import { StateReformingService } from "../../../../providers/global/state-reforming.service";
import { StorageService } from '../../../../providers/natives/storage.service';
import { DefectsService } from "../../../../providers/defects/defects.service";

@IonicPage()
@Component({
  selector: 'page-test-review',
  templateUrl: 'test-review.html',
})
export class TestReviewPage implements OnInit {
  visit: VisitModel;
  latestTest: TestModel;
  completedFields = [];
  appStrings;
  dateFormat;
  testTypeResults;
  deficiencyCategory;
  submitInProgress: boolean = false;
  isTestSubmitted: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public visitService: VisitService,
              public commonFunctions: CommonFunctionsService,
              public viewCtrl: ViewController,
              public events: Events,
              public defectsService: DefectsService,
              private vehicleService: VehicleService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private testResultService: TestResultService,
              private stateReformingService: StateReformingService,
              private openNativeSettings: OpenNativeSettings,
              private testService: TestService,
              private loadingCtrl: LoadingController,
              private storageService: StorageService) {
    this.visit = this.navParams.get('visit');
    this.latestTest = this.visitService.getLatestTest();
  }

  ngOnInit(): void {
    this.appStrings = APP_STRINGS;
    this.dateFormat = DATE_FORMAT;
    this.testTypeResults = TEST_TYPE_RESULTS;
    this.deficiencyCategory = DEFICIENCY_CATEGORY;
    this.storageService.watchStorage().subscribe(() => {
      this.isTestSubmitted = localStorage.getItem(LOCAL_STORAGE.IS_TEST_SUBMITTED);
      this.isTestSubmitted ? this.viewCtrl.showBackButton(false) : this.viewCtrl.showBackButton(true);
    });
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText(APP_STRINGS.TEST);
  }

  getVehicleTypeIconToShow(vehicle: VehicleModel) {
    return vehicle.techRecord.vehicleType.toLowerCase();
  }

  getOdometerStringToBeDisplayed(vehicle) {
    let unit = vehicle.odometerMetric === ODOMETER_METRIC.KILOMETRES ? 'km' : 'mi';
    return this.vehicleService.formatOdometerReadingValue(vehicle.odometerReading) + ' ' + unit;
  }

  completeFields(testType) {
    if (testType[TEST_TYPE_INPUTS.SIC_CARRIED_OUT]) {
      this.completedFields[TEST_TYPE_INPUTS.SIC_CARRIED_OUT] = testType[TEST_TYPE_INPUTS.SIC_CARRIED_OUT];
    }
    if (testType[TEST_TYPE_INPUTS.SIC_SEATBELTS_NUMBER]) {
      this.completedFields[TEST_TYPE_INPUTS.SIC_SEATBELTS_NUMBER] = testType[TEST_TYPE_INPUTS.SIC_SEATBELTS_NUMBER];
    }
    if (testType[TEST_TYPE_INPUTS.SIC_LAST_DATE]) {
      this.completedFields[TEST_TYPE_INPUTS.SIC_LAST_DATE] = testType[TEST_TYPE_INPUTS.SIC_LAST_DATE];
    }
  }

  getTestTypeOptionalFieldsToDisplay(testType: TestTypeModel, field) {
    let testTypesFieldsMetadata = TestTypesFieldsMetadata.FieldsMetadata;
    for (let testTypeFieldMetadata of testTypesFieldsMetadata) {
      if (testType.testTypeId === testTypeFieldMetadata.testTypeId) {
        return field === 'defects' ? testTypeFieldMetadata.hasDefects : testTypeFieldMetadata.hasNotes;
      }
    }
  }

  openTestDetailsPage(vehicle, testType) {
    let initialTestType = this.commonFunctions.cloneObject(testType);
    this.completeFields(testType);
    const MODAL = this.modalCtrl.create(PAGE_NAMES.COMPLETE_TEST_PAGE, {
      vehicle: vehicle,
      vehicleTest: testType,
      completedFields: this.completedFields,
      fromTestReview: true
    });
    MODAL.onDidDismiss(data => {
      if (initialTestType[TEST_TYPE_INPUTS.CERTIFICATE_NUMBER] && !data[TEST_TYPE_INPUTS.CERTIFICATE_NUMBER]) {
        this.navCtrl.pop();
      }
    });
    MODAL.present();
  }

  submitTest(test: TestModel) {
    if (!this.submitInProgress) {
      const ALERT = this.alertCtrl.create({
        title: APP_STRINGS.SUBMIT_TEST,
        message: APP_STRINGS.SUBMIT_TEST_MESSAGE,
        buttons: [
          {
            text: APP_STRINGS.CANCEL,
            handler: () => {
              this.submitInProgress = false;
            }
          },
          {
            text: APP_STRINGS.SUBMIT,
            handler: () => {
              this.storageService.setItem(LOCAL_STORAGE.IS_TEST_SUBMITTED, 'true');
              this.submitInProgress = true;
              test.status = TEST_REPORT_STATUSES.SUBMITTED;
              this.testService.endTestReport(test);
              this.submit(test);
            }
          }
        ]
      });
      ALERT.present();
    }
  }

  submit(test) {
    let stack: Observable<any>[] = [];
    const TRY_AGAIN_ALERT = this.alertCtrl.create({
      title: APP_STRINGS.UNABLE_TO_SUBMIT_TESTS_TITLE,
      message: APP_STRINGS.NO_INTERNET_CONNECTION,
      buttons: [{
        text: APP_STRINGS.SETTINGS_BTN,
        handler: () => {
          this.openNativeSettings.open('settings');
        }
      }, {
        text: APP_STRINGS.TRY_AGAIN_BTN,
        handler: () => {
          this.submit(test);
        }
      }]
    });

    const LOADING = this.loadingCtrl.create({
      content: 'Loading...'
    });
    LOADING.present();

    for (let vehicle of test.vehicles) {
      let testResult = this.testResultService.createTestResult(this.visit, test, vehicle);
      stack.push(this.testResultService.submitTestResult(testResult));
      Observable.forkJoin(stack).pipe(
        tap(
          () => this.events.publish(APP.TEST_SUBMITTED))
      ).subscribe(
        () => {
          this.storageService.removeItem(LOCAL_STORAGE.IS_TEST_SUBMITTED);
          LOADING.dismiss();
          this.submitInProgress = false;
          let views = this.navCtrl.getViews();
          for (let i = views.length - 1; i >= 0; i--) {
            if (views[i].component.name == PAGE_NAMES.VISIT_TIMELINE_PAGE) {
              this.stateReformingService.onTestReview();
              this.navCtrl.popTo(views[i]);
            }
          }

        },
        () => {
          LOADING.dismiss();
          TRY_AGAIN_ALERT.present();
        }
      )
    }

  }

}
