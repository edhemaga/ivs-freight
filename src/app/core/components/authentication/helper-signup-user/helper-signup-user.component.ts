import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth.service';
import { SignUpUserInfo } from '../../../model/signUpUserInfo';

@Component({
  selector: 'app-helper-signup-user',
  templateUrl: './helper-signup-user.component.html',
  styleUrls: ['./helper-signup-user.component.scss'],
})
export class HelperSignupUserComponent implements OnInit {
  private signUpUser: SignUpUserInfo;

  constructor(
    private route: ActivatedRoute,
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.signUpUser = {
        firstName: params['FirstName'],
        lastName: params['LastName'],
        address: params['Address'],
        addressUnit: params['AddressUnit'],
        phone: params['Phone'],
        email: params['Email'],
        code: params['Code'].split(' ').join('+'),
      };
    });

    this.authStoreService.getSignUpUserInfo(this.signUpUser);

    this.router.navigate(['/auth/register-user']);
  }
}
