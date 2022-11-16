import {
   Component,
   ChangeDetectionStrategy,
   Input,
   OnInit,
} from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
   selector: 'app-navigation-user-company',
   templateUrl: './navigation-user-company.component.html',
   styleUrls: ['./navigation-user-company.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationUserCompanyComponent implements OnInit {
   @Input() isNavigationHoveredAndPanelOpen: boolean = false;

   public userCompanies: any[];

   constructor(private navigationService: NavigationService) {}

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

   public identity(index: number, item: any): number {
      return item.id;
   }
}
