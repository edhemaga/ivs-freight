import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
} from '@angular/core';
import { SelectCompanyResponse } from 'appcoretruckassist';
import { AuthStoreService } from '../../authentication/state/auth.service';
import { NavigationService } from '../services/navigation.service';
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';

@Component({
    selector: 'app-navigation-user-company',
    templateUrl: './navigation-user-company.component.html',
    styleUrls: ['./navigation-user-company.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUserCompanyComponent implements OnInit {
    @Input() isNavigationHoveredAndPanelOpen: boolean = false;

    public userCompanies: any[];

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
        this.userCompanies = JSON.parse(localStorage.getItem('user')).companies;
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
