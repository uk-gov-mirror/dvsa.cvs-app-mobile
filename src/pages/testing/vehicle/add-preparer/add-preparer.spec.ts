import { AddPreparerPage } from "./add-preparer";
import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { PreparerService } from "../../../../providers/preparer/preparer.service";
import { IonicModule, NavController, NavParams, ViewController } from "ionic-angular";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestService } from "../../../../providers/test/test.service";
import { ViewControllerMock } from "../../../../../test-config/ionic-mocks/view-controller.mock";
import { VehicleService } from "../../../../providers/vehicle/vehicle.service";
import { VehicleServiceMock } from "../../../../../test-config/services-mocks/vehicle-service.mock";
import { TechRecordDataMock } from "../../../../assets/data-mocks/tech-record-data.mock";
import { VisitDataMock } from "../../../../assets/data-mocks/visit-data.mock";
import { NavParamsMock } from "../../../../../test-config/ionic-mocks/nav-params.mock";
import { VehicleTechRecordModel } from "../../../../models/vehicle/tech-record.model";
import { VisitService } from "../../../../providers/visit/visit.service";

describe('Component: AddPreparerPage', () => {
  let comp: AddPreparerPage;
  let fixture: ComponentFixture<AddPreparerPage>;
  let preparerService: PreparerService;
  let testService: TestService;
  let navCtrl: NavController;
  let vehicleService: VehicleService;
  let visitService: VisitService;

  const TECH_RECORD: VehicleTechRecordModel = TechRecordDataMock.VehicleTechRecordData;

  beforeEach(async(() => {
    const preparerServiceSpy = jasmine.createSpyObj('PreparerService', ['getPreparersFromStorage, search']);

    TestBed.configureTestingModule({
      declarations: [AddPreparerPage],
      imports: [
        IonicModule.forRoot(AddPreparerPage)
      ],
      providers: [
        NavController,
        TestService,
        {provide: NavParams, useClass: NavParamsMock},
        {provide: PreparerService, useValue: preparerServiceSpy},
        {provide: VehicleService, useClass: VehicleServiceMock},
        {provide: ViewController, useClass: ViewControllerMock},
        {provide: VisitService, useClass: VisitDataMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreparerPage);
    comp = fixture.componentInstance;
    preparerService = TestBed.get(PreparerService);
    testService = TestBed.get(TestService);
    navCtrl = TestBed.get(NavController);
    vehicleService = TestBed.get(VehicleService);
    visitService = TestBed.get(VisitService);
  });

  beforeEach(() => {
    const navParams = fixture.debugElement.injector.get(NavParams);

    navParams.get = jasmine.createSpy('get').and.callFake((param) => {
      const params = {
        'test': VisitDataMock.VisitTestData,
        'vehicle': TECH_RECORD
      };
      return params[param];
    })
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    preparerService = null;
    testService = null;
    vehicleService = null;
    visitService = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(preparerService).toBeTruthy();
    expect(testService).toBeTruthy();
    expect(visitService).toBeTruthy();
  });

  it('should VehicleService and TestCancelPage Component share the same instance',
    inject([VehicleService], (injectService: VehicleService) => {
      expect(injectService).toBe(vehicleService);
    })
  );

  it('should make variable true on searchBar focus on', () => {
    let ev = 'something';
    let hideCancel = false;
    comp.focusOut = false;
    expect(comp.focusOut).toBeFalsy();
    comp.keepCancelOn(ev, hideCancel);
    expect(comp.focusOut).toBeTruthy();
  });
});
