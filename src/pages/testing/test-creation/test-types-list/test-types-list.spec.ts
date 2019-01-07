import { async, ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { IonicModule, NavController, NavParams } from "ionic-angular";
import { NavParamsMock } from "../../../../../test-config/ionic-mocks/nav-params.mock";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { StorageService } from "../../../../providers/natives/storage.service";
import { TestTypesListPage } from "./test-types-list";
import { TestTypesService } from "../../../../providers/test-types/test-type.service";
import { TestTypesDataMock } from "../../../../assets/data-mocks/test-types.mock";
import { TestTypesModel } from "../../../../models/reference-data-models/test-types.model";
import { PipesModule } from "../../../../pipes/pipes.module";
import { VehicleDataMock } from "../../../../assets/data-mocks/vehicle-data.mock";
import { VehicleModel } from "../../../../models/vehicle/vehicle.model";
import { VehicleService } from "../../../../providers/vehicle/vehicle.service";

describe('Component: TestTypesListPage', () => {
  let comp: TestTypesListPage;
  let fixture: ComponentFixture<TestTypesListPage>;

  let navCtrl: NavController;
  let navParams: NavParams;
  let testTypesService: TestTypesService;
  let storageServiceSpy: any;

  const testTypes: TestTypesModel[] = TestTypesDataMock.TestTypesData;
  const vehicle: VehicleModel = VehicleDataMock.VehicleData;

  beforeEach(async(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      'read': new Promise(resolve => resolve(testTypes))
    });

    TestBed.configureTestingModule({
      declarations: [TestTypesListPage],
      imports: [
        PipesModule,
        IonicModule.forRoot(TestTypesListPage)
      ],
      providers: [
        NavController,
        TestTypesService,
        VehicleService,
        {provide: NavParams, useClass: NavParamsMock},
        {provide: StorageService, useValue: storageServiceSpy}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTypesListPage);
    comp = fixture.componentInstance;
    navCtrl = TestBed.get(NavController);
    navParams = TestBed.get(NavParams);
    testTypesService = TestBed.get(TestTypesService);
  });

  beforeEach(() => {
    const navParams = fixture.debugElement.injector.get(NavParams);

    navParams.get = jasmine.createSpy('get').and.callFake((param) => {
      const params = {
        'testTypeReferenceData': null,
        'vehicleData': vehicle
      };
      return params[param];
    })
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    testTypesService = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(testTypesService).toBeTruthy();
  });

  it('should TestTypesService and TestTypesListPage Component share the same instance',
    inject([TestTypesService], (injectService: TestTypesService) => {
      expect(injectService).toBe(testTypesService);
    })
  );
});
