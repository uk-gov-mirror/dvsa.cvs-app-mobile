import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {TestReportModel} from '../../../../../models/tests/test-report.model';
import {TestReportService} from "../../../../../providers/test-report/test-report.service";
import { VehicleModel } from "../../../../../models/vehicle/vehicle.model";

@IonicPage()
@Component({
  selector: 'page-vehicle-details',
  templateUrl: 'vehicle-details.html'
})
export class VehicleDetailsPage {
  testReport: TestReportModel;
  vehicle: VehicleModel;

  constructor(public navCtrl: NavController, 
              private navParams: NavParams, 
              private testReportService: TestReportService, 
              public viewCtrl: ViewController,
              public alertCtrl: AlertController) {
    this.testReport = this.testReportService.getTestReport();
    this.vehicle = navParams.get('vehicle');
    this.viewCtrl = viewCtrl;
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('Identify Vehicle');
  }

  addVehicle(): void {
    let self = this;
    this.testReportService.addVehicle(this.vehicle);
    if (self.navCtrl.getByIndex(self.navCtrl.length() - 3).component.name == 'VisitTimelinePage') {
      this.navCtrl.insert(this.navCtrl.length() - 2, 'TestCreatePage')
        .then(() => {
            self.navCtrl.popTo(self.navCtrl.getByIndex(self.navCtrl.length() - 3));
          }
        );
    } else {
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
    }
  }

  goToPreparerPage(): void {
    let confirm = this.alertCtrl.create({
      title: 'Confirm vehicle',
      message: 'This action will confirm the vehicle for testing.',
      buttons: [
        {
          text: 'Cancel',
        }, {
          text: 'Confirm',
          handler: () => {
            this.testReportService.addVehicle(this.vehicle);
            this.navCtrl.push('AddPreparerPage');
          }
        }
      ]
    });
    confirm.present();
  }

  refuseVehicle(): void {

  }

  showVehicleBrakes(): void {
    this.navCtrl.push('VehicleBrakesPage');
  }
  
  showVehicleTyres(): void {
    this.navCtrl.push('VehicleTyresPage');
  }
  
  showVehicleWeights(): void {
    this.navCtrl.push('VehicleWeightsPage');
  }
  
  showVehicleAdditional(): void {
    this.navCtrl.push('VehicleAdditionalPage');
	}
}
