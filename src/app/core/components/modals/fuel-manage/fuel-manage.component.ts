import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SharedService} from "../../../services/shared/shared.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {AppLoadService} from "../../../services/load/app-load.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {DriverService} from "../../../services/driver/driver.service";
import {AppFuelService} from "../../../services/shared/app-fuel.service";
import { TruckService } from 'src/app/core/services/truck/truck.service';

@Component({
  selector: 'app-fuel-manage',
  templateUrl: './fuel-manage.component.html',
  styleUrls: ['./fuel-manage.component.scss']
})
export class FuelManageComponent implements OnInit {

  @Input() inputData: any;
  public bankData: any;
  fuelForm: FormGroup;
  public steps: any = {year: 1, month: 1, day: 1, hour: 1, minute: 15, second: 0};
  modalTitle = 'Add Fuel';
  truckList: any;
  driversList: any;
  driverData = {
    driverName: '',
    driverId: '',
  };
  public options = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  loadData = [];
  fuelCategories: any[] = [];
  fuelTotal: any = 0;
  timePickerValue: Date;

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private truckService: TruckService,
    public sharedService: SharedService,
    private spinner: SpinnerService,
    public driverService: DriverService,
    private notification: NotificationService,
    public fuelService: AppFuelService,
    private loadService: AppLoadService
  ) {
  }

  public get fuelItems() {
    return (this.fuelForm.get('doc') as FormGroup).get('fuel') as FormArray;
  }

  ngOnInit(): void {
    this.createForm();
    this.getTrucks();
    this.getLoads();
    this.getFuelCategoryList();

    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'Add Fuel';
      if (this.inputData.data.truckId) {
        this.fuelForm.patchValue({
          truckId: parseInt(this.inputData.data.truckId),
        });
      }
    } else {
      this.modalTitle = 'Edit Fuel';
      if (this.inputData.data.id) {
        this.fuelService.getFuelById(this.inputData.data.id).subscribe((res: any) => {
          if (res.doc.transactionDateTime) {
            this.timePickerValue = new Date(res.doc.transactionDateTime);
          }

          this.fuelForm.patchValue({
            truckId: res.truckId,
            transactionDate: new Date(res.transactionDate),
            driverId: res.driverId,
            location: res.location,
            name: res.name,
          });

          this.driverService.getDriverData(res.driverId, 'all').subscribe(
            (driver) => {
              this.driverData = {
                driverId: res.driverId,
                driverName: driver.firstName + ' ' + driver.lastName,
              };
            },
            () => {
              this.driverData = {
                driverId: '',
                driverName: '',
              };
            }
          );

          res.fuelItem.map((item, indx) => {
            if (this.fuelItems.at(indx)) {
              this.fuelItems.at(indx).patchValue({
                category: item.category,
                qty: item.qty,
                price: item.price,
                subtotal: item.subtotal,
              });
            } else {
              this.addEditCategory(item);
            }
          });

          this.calculateTotal();
        });
      }
    }
  }

  getFuelCategoryList() {
    const fuelCategories = JSON.parse(localStorage.getItem('fuelCategories'));

    if (!fuelCategories) {
      this.fuelService.getFuelCategoryList().subscribe((categories: any) => {
        this.fuelCategories = categories;
        localStorage.setItem('fuelCategories', JSON.stringify({data: this.fuelCategories}));
      });
    } else {
      this.fuelCategories = fuelCategories.data;
    }
  }

  public getTrucks(): void {
    this.truckService.getTruckList(1, 25).subscribe((truckTabData: any) => {
      this.truckList = truckTabData.pagination.data;
    });
  }

  public getLoads() {
    this.loadService.getDispatchData().subscribe((res: any) => {
      this.loadData = res;
    });
  }

  removeCategories(indx: number) {
    this.fuelItems.removeAt(indx);
    this.calculateTotal();
  }

  createForm() {
    this.fuelForm = this.formBuilder.group({
      truckId: [null, Validators.required],
      transactionDate: [null, Validators.required],
      driverId: [null],
      location: [null, Validators.required],
      name: [null],
      doc: this.formBuilder.group({
        fuel: this.formBuilder.array([
          this.formBuilder.group({
            category: [null, Validators.required],
            qty: [null, Validators.required],
            price: [null, Validators.required],
            subtotal: [0],
          }),
        ]),
        transactionDateTime: [null],
      }),
    });
  }

  public addCategory(): void {
    this.fuelItems.push(
      this.formBuilder.group({
        category: [null, Validators.required],
        qty: [null, Validators.required],
        price: [null, Validators.required],
        subtotal: [0],
      })
    );
  }

  public addEditCategory(result): void {
    this.fuelItems.push(
      this.formBuilder.group({
        category: [result.category, Validators.required],
        qty: [result.qty, Validators.required],
        price: [result.price, Validators.required],
        subtotal: [result.subtotal],
      })
    );
  }

  selectTruck(truckSelected) {
    let hasTruckId = false;
    this.loadData.map((load) => {
      if (load.truckId === truckSelected.id) {
        hasTruckId = true;
        this.driverData = load.driverName
          ? {
            driverName: load.driverName,
            driverId: load.driverId,
          }
          : {driverName: '', driverId: ''};
      }
    });

    if (!hasTruckId) {
      this.driverData = {driverName: '', driverId: ''};
    }
  }

  pickupDateTimeChange(e) {
    this.fuelForm.get('doc.transactionDateTime').setValue(e);
  }

  public handleAddressChange(address: any) {
    const location = this.sharedService.selectAddress(null, address);
    /*   const final_address = `${faddress.city}, ${faddress.stateShortName} ${faddress.zipCode}`;
    this.fuelForm.get('location').setValue(final_address.trim()); */
    this.fuelForm.get('location').setValue(location.address);
  }

  pickupDateDateChange(e) {
    this.fuelForm.get('transactionDate').setValue(e);
  }

  closeModal() {
    this.activeModal.close();
  }

  saveFuel() {
    if (this.fuelForm.invalid) {
      if (!this.sharedService.markInvalid(this.fuelForm)) {
        return false;
      }
      return;
    }

    this.spinner.show(true);
    const fuelForm = this.fuelForm.getRawValue();

    const dataToSave = {
      driverId: this.driverData.driverId,
      truckId: fuelForm.truckId,
      location: fuelForm.location,
      name: fuelForm.name,
      transactionDate: fuelForm.transactionDate,
      total: this.getTotal(fuelForm.doc?.fuel),
      doc: {
        transactionDateTime: fuelForm.doc?.transactionDateTime,
      },
      fuelItems: fuelForm.doc?.fuel ? fuelForm.doc.fuel : [],
    };

    console.log('dataToSave');
    console.log(dataToSave);

    if (this.inputData.data.type === 'new') {
      this.fuelService.addFuel(dataToSave).subscribe((res: any) => {
        this.fuelForm.reset();
        this.activeModal.close();
        this.spinner.show(false);
        this.notification.success('Fuel added successfully.', 'Success:');
        this.fuelService.newFuelAdd.next(res);
      });
    } else {
      dataToSave.doc.transactionDateTime = this.timePickerValue;
      this.fuelService.editFuelById(dataToSave, this.inputData.data.id).subscribe((res: any) => {
        this.fuelForm.reset();
        this.activeModal.close();
        this.spinner.show(false);
        this.notification.success('Fuel updated successfully.', 'Success:');
        this.fuelService.editFuel.next({id: res.id});
      });
    }
  }

  getTotal(fuels: any[]) {
    if (fuels.length) {
      let fuelTotal = 0;

      fuels.map((fuel) => {
        fuelTotal += fuel.price * fuel.qty;
      });

      return fuelTotal;
    } else {
      return 0;
    }
  }

  truckListSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.truckNumber.toLocaleLowerCase().indexOf(term) > -1;
  }

  categorySearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.fuelCategory.toLocaleLowerCase().indexOf(term) > -1;
  }

  calculateSubTotalAndTotal(indx) {
    const qty = this.fuelItems.at(indx).get('qty').value
      ? this.fuelItems.at(indx).get('qty').value
      : 0;
    const price = this.fuelItems.at(indx).get('price').value
      ? this.fuelItems.at(indx).get('price').value
      : 0;
    this.fuelItems
      .at(indx)
      .get('subtotal')
      .setValue(qty * price);
    this.calculateTotal();
  }

  calculateTotal() {
    this.fuelTotal = 0;
    this.fuelItems.value.forEach((element) => {
      if (element.subtotal) {
        this.fuelTotal += element.subtotal;
      }
    });
  }

}
