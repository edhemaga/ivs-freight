import { Observable } from 'rxjs';
import { SettingsTerminalModalComponent } from '../../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { SettingsRepairshopModalComponent } from '../../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsOfficeModalComponent } from '../../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from '../../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { Injectable } from '@angular/core';

import { SettingsBasicModalComponent } from '../../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
  CompanyModalResponse,
  CompanyResponse,
  CompanyService,
  CreateDivisionCompanyCommand,
  CreateInsurancePolicyCommand,
  CreateResponse,
  InsurancePolicyModalResponse,
  UpdateCompanyCommand,
  UpdateDivisionCompanyCommand,
  UpdateFactoringCompanyCommand,
  UpdateInsurancePolicyCommand,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class SettingsCompanyService {
  constructor(
    private modalService: ModalService,
    private settingService: CompanyService
  ) {}

  /**
   * Open Modal
   * @param type - is modal active
   * @param modalName - modal name
   * @param action - type of tab-switcher to be active
   */
  public onModalAction(data: {
    modalName: string;
    type?: string;
    company?: any;
  }) {
    switch (data.modalName) {
      case 'basic': {
        this.modalService.openModal(
          SettingsBasicModalComponent,
          {
            size: 'medium',
          },
          {
            type: data.type,
            company: data.company,
          }
        );
        break;
      }
      case 'insurance-policy': {
        this.modalService.openModal(
          SettingsInsurancePolicyModalComponent,
          {
            size: 'small',
          },
          {
            type: data.type,
            company: data.company,
          }
        );
        break;
      }
      case 'factoring': {
        this.modalService.openModal(
          SettingsFactoringModalComponent,
          {
            size: 'small',
          },
          {
            type: data.type,
            company: data.company,
          }
        );
        break;
      }
      default:
        break;
    }
  }

  // Main Company
  public updateCompany(data: UpdateCompanyCommand): Observable<object> {
    return this.settingService.apiCompanyPut(data);
  }

  public getCompany(): Observable<CompanyResponse> {
    return this.settingService.apiCompanyGet();
  }

  public getCompanyModal(): Observable<CompanyModalResponse> {
    return this.settingService.apiCompanyModalGet();
  }

  // Division Company
  public addCompanyDivision(
    data: CreateDivisionCompanyCommand
  ): Observable<CreateResponse> {
    return this.settingService.apiCompanyDivisionPost(data);
  }

  public updateCompanyDivision(
    data: UpdateDivisionCompanyCommand
  ): Observable<object> {
    return this.settingService.apiCompanyDivisionPut(data);
  }

  public getCompanyDivisionById(id: number): Observable<CompanyResponse> {
    return this.settingService.apiCompanyDivisionIdGet(id);
  }

  public deleteCompanyDivisionById(id: number): Observable<any> {
    return this.settingService.apiCompanyDivisionIdDelete(id);
  }

  // Insurance Policy
  public getInsurancePolicyModal(): Observable<InsurancePolicyModalResponse> {
    return this.settingService.apiCompanyInsurancepolicyModalGet();
  }

  public deleteInsurancePolicyById(id: number): Observable<any> {
    return this.settingService.apiCompanyInsurancepolicyIdDelete(id);
  }

  public addInsurancePolicy(
    data: CreateInsurancePolicyCommand
  ): Observable<CreateResponse> {
    return this.settingService.apiCompanyInsurancepolicyPost(data);
  }

  public updateInsurancePolicy(
    data: UpdateInsurancePolicyCommand
  ): Observable<object> {
    return this.settingService.apiCompanyInsurancepolicyPut(data);
  }

  public getInsurancePolicyById(id: number): Observable<object> {
    return this.settingService.apiCompanyInsurancepolicyIdGet(id);
  }

  // Factoring Company
  public updateFactoringCompany(
    data: UpdateFactoringCompanyCommand
  ): Observable<object> {
    return this.settingService.apiCompanyFactoringcompanyPut(data);
  }

  public deleteFactoringCompanyById(id: number): Observable<any> {
    return this.settingService.apiCompanyFactoringcompanyIdDelete(id);
  }
}
