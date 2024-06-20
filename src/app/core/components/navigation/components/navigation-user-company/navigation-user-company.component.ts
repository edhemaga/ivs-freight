import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import { SelectCompanyResponse } from 'appcoretruckassist';
import { SignInResponse } from 'appcoretruckassist';

// services
import { NavigationService } from '@core/components/navigation/services/navigation.service';
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';

@Component({
    selector: 'app-navigation-user-company',
    templateUrl: './navigation-user-company.component.html',
    styleUrls: ['./navigation-user-company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule],
})
export class NavigationUserCompanyComponent implements OnInit {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;
    public userCompanies: any[];
    @Output() companiesExists = new EventEmitter<boolean>();

    constructor(
        private navigationService: NavigationService,
        private websiteAuthService: WebsiteAuthService
    ) {}

    ngOnInit(): void {
        let arr = JSON.parse(localStorage.getItem('user')).companies;

        arr.length > 1
            ? ((this.userCompanies = arr), this.companiesExists.emit(true))
            : this.companiesExists.emit(false);
    }

    public onAction() {
        this.navigationService.onDropdownActivation({
            name: 'User Company Details',
            type: false,
        });
    }

    public onSelectCompany(company: any) {
        this.websiteAuthService
            .selectCompanyAccount({ companyId: company.id })
            .subscribe({
                next: (res: SelectCompanyResponse) => {
                    let user: SignInResponse = JSON.parse(
                        localStorage.getItem('user')
                    );
                    user = {
                        ...user,
                        /*  avatar: res.avatar, */
                        companyName: res.companyName,
                        companyUserId: res.companyUserId,
                        driverId: res.driverId,
                        firstName: res.firstName,
                        lastName: res.lastName,
                        token: res.token,
                        refreshToken: res.refreshToken,
                        userId: res.userId,
                        companies: user.companies.map((item) => {
                            return {
                                ...item,
                                isActive: item.companyName === res.companyName,
                            };
                        }),
                    };

                    localStorage.setItem('user', JSON.stringify(user));

                    window.location.reload();
                },
                error: () => {},
            });
    }

    public identity(index: number, item: any): number {
        return item.id;
    }
}
