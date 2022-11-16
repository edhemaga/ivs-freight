import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

import { SettingsBasicModalComponent } from '../../settings-company/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../../settings-company/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../../settings-company/company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { CreateInsurancePolicyCommand } from 'appcoretruckassist/model/createInsurancePolicyCommand';
import { UpdateInsurancePolicyCommand } from 'appcoretruckassist/model/updateInsurancePolicyCommand';
import {
  CompanyModalResponse,
  CompanyResponse,
  CompanyService,
  CreateDivisionCompanyCommand,
  CreateResponse,
  InsurancePolicyModalResponse,
  UpdateCompanyCommand,
  UpdateDivisionCompanyCommand,
  UpdateFactoringCompanyCommand,
} from 'appcoretruckassist';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { CompanyStore } from './company-settings.store';
import { getFunctionParams } from 'src/app/core/utils/methods.globals';

@Injectable({ providedIn: 'root' })
export class SettingsCompanyService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private settingService: CompanyService,
    private tableService: TruckassistTableService,
    private companyStore: CompanyStore
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
    return this.settingService.apiCompanyPut(data).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              this.companyStore.add(company);
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
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
    return this.settingService.apiCompanyDivisionPost(data).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              const companiesCount = JSON.parse(
                localStorage.getItem('companiesCount')
              );

              companiesCount.numberOfCompany++;
              localStorage.setItem(
                'companiesCount',
                JSON.stringify({
                  numberOfCompany: companiesCount.numberOfCompany,
                })
              );
              this.companyStore.add(company);
              this.tableService.sendActionAnimation({
                animation: 'add',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }

  public updateCompanyDivision(
    data: UpdateDivisionCompanyCommand
  ): Observable<object> {
    return this.settingService.apiCompanyDivisionPut(data).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              this.companyStore.add(company);
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }

  public getCompanyDivisionById(id: number): Observable<CompanyResponse> {
    return this.settingService.apiCompanyDivisionIdGet(id);
  }

  public deleteCompanyDivisionById(id: number): Observable<any> {
    return this.settingService.apiCompanyDivisionIdDelete(id).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              const companiesCount = JSON.parse(
                localStorage.getItem('companiesCount')
              );

              companiesCount.numberOfCompany--;
              this.tableService.sendActionAnimation({
                animation: 'delete',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }

  // Insurance Policy
  public getInsurancePolicyModal(): Observable<InsurancePolicyModalResponse> {
    return this.settingService.apiCompanyInsurancepolicyModalGet();
  }

  public deleteInsurancePolicyById(id: number): Observable<any> {
    return this.settingService.apiCompanyInsurancepolicyIdDelete(id).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              this.tableService.sendActionAnimation({
                animation: 'delete',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }

  //CreateInsurancePolicyCommand
  public addInsurancePolicy(data: any): Observable<CreateResponse> {
    const sortedParams = getFunctionParams(
      this.settingService.apiCompanyInsurancepolicyPost,
      data
    );
    return this.settingService
      .apiCompanyInsurancepolicyPost(...sortedParams)
      .pipe(
        tap((res: any) => {
          const companySub = this.getCompany()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (company: CompanyResponse | any) => {
                this.companyStore.add(company);
                this.tableService.sendActionAnimation({
                  animation: 'add',
                  data: company,
                  id: company.id,
                });

                companySub.unsubscribe();
              },
            });
        })
      );
  }

  //UpdateInsurancePolicyCommand
  public updateInsurancePolicy(data: any): Observable<object> {
    const sortedParams = getFunctionParams(
      this.settingService.apiCompanyInsurancepolicyPut,
      data
    );
    return this.settingService
      .apiCompanyInsurancepolicyPut(...sortedParams)
      .pipe(
        tap((res: any) => {
          const companySub = this.getCompany()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (company: CompanyResponse | any) => {
                this.companyStore.add(company);
                this.tableService.sendActionAnimation({
                  animation: 'update',
                  data: company,
                  id: company.id,
                });

                companySub.unsubscribe();
              },
            });
        })
      );
  }

  public getInsurancePolicyById(id: number): Observable<object> {
    return this.settingService.apiCompanyInsurancepolicyIdGet(id);
  }

  // Factoring Company
  public updateFactoringCompany(
    data: UpdateFactoringCompanyCommand
  ): Observable<object> {
    return this.settingService.apiCompanyFactoringcompanyPut(data).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              this.companyStore.add(company);
              this.tableService.sendActionAnimation({
                animation: 'update',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }

  public deleteFactoringCompanyById(id: number): Observable<any> {
    return this.settingService.apiCompanyFactoringcompanyIdDelete(id).pipe(
      tap((res: any) => {
        const companySub = this.getCompany()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (company: CompanyResponse | any) => {
              this.tableService.sendActionAnimation({
                animation: 'delete',
                data: company,
                id: company.id,
              });

              companySub.unsubscribe();
            },
          });
      })
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
