import { Observable } from 'rxjs';
import { SettingsTerminalModalComponent } from './../settings-location/location-modals/settings-terminal-modal/settings-terminal-modal.component';
import { SettingsRepairshopModalComponent } from './../settings-location/location-modals/settings-repairshop-modal/settings-repairshop-modal.component';
import { SettingsOfficeModalComponent } from './../settings-location/location-modals/settings-office-modal/settings-office-modal.component';
import { SettingsParkingModalComponent } from './../settings-location/location-modals/settings-parking-modal/settings-parking-modal.component';
import { Injectable } from '@angular/core';

import { SettingsBasicModalComponent } from '../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  CompanyModalResponse,
  CompanyResponse,
  CompanyService,
  CreateDivisionCompanyCommand,
  CreateInsurancePolicyAddonCommand,
  CreateInsurancePolicyCommand,
  CreateResponse,
  InsurancePolicyModalResponse,
  UpdateCompanyCommand,
  UpdateDivisionCompanyCommand,
  UpdateFactoringCompanyCommand,
  UpdateInsurancePolicyCommand,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class SettingsStoreService {
  constructor(
    private modalService: ModalService,
    private settingCompanyService: CompanyService
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
      case 'parking': {
        this.modalService.openModal(SettingsParkingModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'office': {
        this.modalService.openModal(SettingsOfficeModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'repairshop': {
        this.modalService.openModal(SettingsRepairshopModalComponent, {
          size: 'small',
        });
        break;
      }
      case 'terminal': {
        this.modalService.openModal(SettingsTerminalModalComponent, {
          size: 'small',
        });
        break;
      }
      default:
        break;
    }
  }

  // Main Company
  public updateCompany(data: UpdateCompanyCommand): Observable<object> {
    return this.settingCompanyService.apiCompanyPut(data);
  }

  public getCompany(): Observable<CompanyResponse> {
    return this.settingCompanyService.apiCompanyGet();
  }

  public getCompanyModal(): Observable<CompanyModalResponse> {
    return this.settingCompanyService.apiCompanyModalGet();
  }

  // Division Company
  public addCompanyDivision(
    data: CreateDivisionCompanyCommand
  ): Observable<CreateResponse> {
    return this.settingCompanyService.apiCompanyDivisionPost(data);
  }

  public updateCompanyDivision(
    data: UpdateDivisionCompanyCommand
  ): Observable<object> {
    return this.settingCompanyService.apiCompanyDivisionPut(data);
  }

  public getCompanyDivisionById(id: number): Observable<CompanyResponse> {
    return this.settingCompanyService.apiCompanyDivisionIdGet(id);
  }

  public deleteCompanyDivisionById(id: number): Observable<any> {
    return this.settingCompanyService.apiCompanyDivisionIdDelete(id);
  }

  // Insurance Policy
  public getInsurancePolicyModal(): Observable<InsurancePolicyModalResponse> {
    return this.settingCompanyService.apiCompanyInsurancepolicyModalGet();
  }
  public deleteInsurancePolicyById(id: number): Observable<any> {
    return this.settingCompanyService.apiCompanyInsurancepolicyIdDelete(id);
  }

  public addInsurancePolicy(
    data: CreateInsurancePolicyCommand
  ): Observable<CreateResponse> {
    return this.settingCompanyService.apiCompanyInsurancepolicyPost(data);
  }

  public updateInsurancePolicy(
    data: UpdateInsurancePolicyCommand
  ): Observable<object> {
    return this.settingCompanyService.apiCompanyInsurancepolicyPut(data);
  }

  // Factoring Company
  public updateFactoringCompany(
    data: UpdateFactoringCompanyCommand
  ): Observable<object> {
    return this.settingCompanyService.apiCompanyFactoringcompanyPut(data);
  }

  public deleteFactoringCompanyById(id: number): Observable<any> {
    return this.settingCompanyService.apiCompanyFactoringcompanyIdDelete(id);
  }
}
