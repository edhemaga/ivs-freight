import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
} from '@angular/core';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
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
    if (this.addressForm && value?.address) {
      this.addressForm.controls['address'].setValue(value.address);
    }
  }
  addresList: any[] = [];
  currentAddress: any;
  searchLayers: any[] = [];
  @Input() inputConfig: ITaInput;
  @Input() placeholderType: string;
  @Output() selectedAddress: EventEmitter<{
    address: AddressEntity;
    valid: boolean;
    longLat: any;
  }> = new EventEmitter<{
    address: AddressEntity;
    valid: boolean;
    longLat: any;
  }>(null);

  @Output() closeDropdown: EventEmitter<boolean> = new EventEmitter<boolean>(
    null
  );

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
    this.getSuperControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((term: string) => {
          if (!term) {
            this.addresList = [];
          }
          return term?.length >= 3;
        }),
        switchMap((query) => {
          return this.addressService.getAddresses(query, this.searchLayers);
        })
      )
      .subscribe((res) => {
        this.addresList = res.addresses.map((item, indx) => {
          return {
            ...item,
            name: item.address.address,
            id: indx,
          };
        });
      });
  }

  ngAfterViewInit(): void {
    this.searchLayers =
      this.placeholderType == 'longAddress'
        ? ['Address']
        : this.placeholderType == 'shortAddress'
        ? ['Locality']
        : [];
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public onCloseDropdown(e) {
    this.closeDropdown.emit(e);
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'address': {
        this.activeAddress = event;
        if (event?.address) {
          this.selectedAddress.emit({
            address: event.address,
            valid: true,
            longLat: event.longLat,
          });
          this.getSuperControl.setValue(event.address.address);
        } else {
          this.addresList = [];
          this.getSuperControl.setValue(null);
        }
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
