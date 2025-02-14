import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

// models
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

// components
import { SettingsBasicModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '@pages/settings/pages/settings-modals/settings-company-modals/settings-factoring-modal/settings-factoring-modal.component';

// services
import { ModalService } from '@shared/services/modal.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { FormDataService } from '@shared/services/form-data.service';

// store
import { CompanyStore } from '@pages/settings/state/company-state/company-settings.store';

// enums
import { eGeneralActions } from '@shared/enums';

@Injectable({ providedIn: 'root' })
export class SettingsCompanyService implements OnDestroy {
    private destroy$ = new Subject<void>();
    public companyId: any = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).companyUserId
        : 0;

    constructor(
        private modalService: ModalService,
        private settingService: CompanyService,
        private tableService: TruckassistTableService,
        private companyStore: CompanyStore,
        private formDataService: FormDataService
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.companyStore.add(company);
                            this.companyStore.update(
                                ({ id }) => id === company.id,
                                {
                                    ...company,
                                    address: company.address,
                                    phone: company.phone,
                                    ein: company.ein,
                                    email: company.email,
                                    usDot: company.usDot,
                                    /*   logo: company.logo, */
                                }
                            );
                            const companiesCount = JSON.parse(
                                localStorage.getItem('user')
                            );

                            localStorage.setItem(
                                'user',
                                JSON.stringify({
                                    ...companiesCount,
                                    areSettingsUpdated: true,
                                })
                            );
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            const companiesCount = JSON.parse(
                                localStorage.getItem('companiesCount')
                            );

                            companiesCount.numberOfCompany++;
                            localStorage.setItem(
                                'companiesCount',
                                JSON.stringify({
                                    numberOfCompany:
                                        companiesCount.numberOfCompany,
                                })
                            );
                            this.companyStore.add(company);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.ADD,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.companyStore.add(company);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
                                data: company,
                                id: company.id,
                                editedDivisionCompId: data.id,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            const companiesCount = JSON.parse(
                                localStorage.getItem('companiesCount')
                            );

                            companiesCount.numberOfCompany--;
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                data: company,
                                id: company.id,
                            });

                            companySub.unsubscribe();
                        },
                    });
            })
        );
    }

    public addInsurancePolicy(data: any): Observable<CreateResponse> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.settingService.apiCompanyInsurancepolicyPost().pipe(
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.companyStore.add(company);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.ADD,
                                data: company,
                                id: company.id,
                                editedDivisionCompId: data.isDivision
                                    ? data.companyId
                                    : null,
                            });

                            companySub.unsubscribe();
                        },
                    });
            })
        );
    }

    public updateInsurancePolicy(data: any): Observable<object> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.settingService.apiCompanyInsurancepolicyPut().pipe(
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.companyStore.add(company);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.companyStore.add(company);
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.UPDATE,
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
            tap(() => {
                const companySub = this.getCompany()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (company: CompanyResponse) => {
                            this.tableService.sendActionAnimation({
                                animation: eGeneralActions.DELETE,
                                data: company,
                                id: company.id,
                            });

                            companySub.unsubscribe();
                        },
                    });
            })
        );
    }

    public getCompanyDocuments(): Observable<any> {
        return this.settingService.apiCompanyDocumentsGet();
    }

    public addCompanyDocuments(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.settingService.apiCompanyDocumentsPost();
    }

    public getCompanyInsurance() {
        return this.settingService.apiCompanyInsurancepolicyGet();
    }

    public getCompanyPayroll() {
        return this.settingService.apiCompanyCompanypayrollGet();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
