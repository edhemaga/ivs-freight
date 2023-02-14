import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { SelectCompanyResponse } from 'appcoretruckassist';
import { AuthStoreService } from '../../authentication/state/auth.service';
import { NavigationService } from '../services/navigation.service';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-navigation-user-company',
    templateUrl: './navigation-user-company.component.html',
    styleUrls: ['./navigation-user-company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class NavigationUserCompanyComponent implements OnInit {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;
    public userCompanies: any[];
    @Output() companiesExists = new EventEmitter<boolean>();

    constructor(
        private navigationService: NavigationService,
        private accountStoreService: AuthStoreService
    ) {}

    ngOnInit(): void {
        // ----------------------- PRODUCSTION MODE ----------------------------
        // if(this.authQuery.getEntity(1)) {
        //   const currentUser: SignInResponse = this.authQuery.getEntity(1);

        //   if (currentUser.token) {
        //     return true;
        //   }
        // }

        // ----------------------- DEVELOP MODE ----------------------------
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
        this.accountStoreService
            .selectCompanyAccount({ companyId: company.id })
            .subscribe({
                next: (res: SelectCompanyResponse) => {
                    let user: SignInResponse = JSON.parse(
                        localStorage.getItem('user')
                    );
                    user = {
                        ...user,
                        avatar: res.avatar,
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
