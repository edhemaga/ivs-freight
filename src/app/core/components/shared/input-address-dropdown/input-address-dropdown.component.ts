import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AddressService } from 'src/app/core/services/shared/address.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-address-dropdown',
  templateUrl: './input-address-dropdown.component.html',
  styleUrls: ['./input-address-dropdown.component.scss'],
})
export class InputAddressDropdownComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public addressForm!: FormGroup;
  selctedAddress: any;
  loadingAddresses: boolean = false;
  addresList: any[] = [];

  constructor(
    private addressService: AddressService,
    private formBuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      address: '',
    });

    this.addressForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => {
        this.getSearchedAdresses(changes.address);
      });
  }

  public getSearchedAdresses(searchedAddress) {
    this.addresList = [];
    if (
      searchedAddress &&
      searchedAddress != '' &&
      searchedAddress?.length > 2
    ) {
      this.loadingAddresses = true;
      this.addressService
        .getAdresses(searchedAddress)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log(res, 'final addresses');
            this.addresList = res.addresses.map((item, indx) => {
              return {
                ...item,
                name: item.address.address,
                id: indx,
              };
            });
            this.loadingAddresses = false;
          },
          error: () => {
            this.loadingAddresses = false;
          },
        });
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'address': {
        this.selctedAddress = event;
        break;
      }
      default: {
        break;
      }
    }
  }
}
