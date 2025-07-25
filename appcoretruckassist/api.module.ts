import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AccidentService } from './api/accident.service';
import { AccountService } from './api/account.service';
import { ActivityLogService } from './api/activityLog.service';
import { ApplicantService } from './api/applicant.service';
import { BankService } from './api/bank.service';
import { BrokerService } from './api/broker.service';
import { CdlService } from './api/cdl.service';
import { ChatService } from './api/chat.service';
import { CitationService } from './api/citation.service';
import { CommentService } from './api/comment.service';
import { CompanyService } from './api/company.service';
import { CompanyAccountService } from './api/companyAccount.service';
import { CompanyAccountLabelService } from './api/companyAccountLabel.service';
import { CompanyContactService } from './api/companyContact.service';
import { CompanyContactLabelService } from './api/companyContactLabel.service';
import { CompanyOfficeService } from './api/companyOffice.service';
import { CompanyUserService } from './api/companyUser.service';
import { DashboardService } from './api/dashboard.service';
import { DepartmentService } from './api/department.service';
import { DispatchService } from './api/dispatch.service';
import { DriverService } from './api/driver.service';
import { EmploymentHistoryService } from './api/employmentHistory.service';
import { EquipentService } from './api/equipent.service';
import { EventService } from './api/event.service';
import { FileService } from './api/file.service';
import { FuelService } from './api/fuel.service';
import { GeolocationService } from './api/geolocation.service';
import { ImportService } from './api/import.service';
import { InspectionService } from './api/inspection.service';
import { IntegrationService } from './api/integration.service';
import { ListCounterService } from './api/listCounter.service';
import { LoadService } from './api/load.service';
import { MapService } from './api/map.service';
import { MedicalService } from './api/medical.service';
import { MilesService } from './api/miles.service';
import { MvrService } from './api/mvr.service';
import { NoteService } from './api/note.service';
import { NotificationDeviceService } from './api/notificationDevice.service';
import { OwnerService } from './api/owner.service';
import { OwnerHistoryService } from './api/ownerHistory.service';
import { ParkingService } from './api/parking.service';
import { PayrollService } from './api/payroll.service';
import { RatingReviewService } from './api/ratingReview.service';
import { RedirectService } from './api/redirect.service';
import { RegistrationService } from './api/registration.service';
import { RepairService } from './api/repair.service';
import { RepairShopService } from './api/repairShop.service';
import { RouteService } from './api/route.service';
import { RoutingService } from './api/routing.service';
import { ShipperService } from './api/shipper.service';
import { StateService } from './api/state.service';
import { StopService } from './api/stop.service';
import { TableConfigService } from './api/tableConfig.service';
import { TagService } from './api/tag.service';
import { TelematicsService } from './api/telematics.service';
import { TerminalService } from './api/terminal.service';
import { TestService } from './api/test.service';
import { TestDeployService } from './api/testDeploy.service';
import { TitleService } from './api/title.service';
import { TodoService } from './api/todo.service';
import { TrailerService } from './api/trailer.service';
import { TrailerTypeService } from './api/trailerType.service';
import { TransmissionModelService } from './api/transmissionModel.service';
import { TruckService } from './api/truck.service';
import { TruckTypeService } from './api/truckType.service';
import { UserService } from './api/user.service';
import { VinDecodeService } from './api/vinDecode.service';
import { ViolationService } from './api/violation.service';
import { WeatherService } from './api/weather.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
