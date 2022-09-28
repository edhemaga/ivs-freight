import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AddressService } from 'src/app/core/services/shared/address.service';
import { AddressEntity } from 'appcoretruckassist';
import {
  FormBuilder,
  FormGroup,
  NgControl,
  ControlValueAccessor,
} from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
  selector: 'app-input-address-dropdown',
  templateUrl: './input-address-dropdown.component.html',
  styleUrls: ['./input-address-dropdown.component.scss'],
})
export class InputAddressDropdownComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  private destroy$ = new Subject<void>();
  public addressForm!: FormGroup;
  @Input() set activeAddress(value) {
    if (this.addressForm && value.address) {
      this.addressForm.controls['address'].setValue(value.address);
    }
  }
  loadingAddresses: boolean = false;
  addresList: any[] = [];
  currentAddress: any;
  @Input() inputConfig: ITaInput;
  @Output() selectedAddress: EventEmitter<{
    address: AddressEntity;
    valid: boolean;
  }> = new EventEmitter<{ address: AddressEntity; valid: boolean }>(null);

  constructor(
    @Self() public superControl: NgControl,
    private addressService: AddressService,
    private formBuilder: FormBuilder
  ) {
    this.superControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange(event: any): void {}

  registerOnTouched(fn: any): void {}

  ngOnInit(): void {
    this.addressForm = this.formBuilder.group({
      address: '',
    });

    this.addressForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(async (query) => this.addressService
        .getAdresses(query))
        )
      .subscribe((changes) => {
        console.log(changes, 'changeschangeschangeschanges')
        //this.getSearchedAdresses(changes.address);
      });
  }

  get getSuperControl() {
    return this.superControl.control;
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
        this.activeAddress = event;
        this.selectedAddress.emit({
          address: event.address,
          valid: true,
        });
        this.getSuperControl.setValue(event.address.address);
        this.getSuperControl.setErrors(null);
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
