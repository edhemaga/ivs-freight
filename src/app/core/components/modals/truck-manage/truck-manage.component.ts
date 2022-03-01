import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {DatePipe} from "@angular/common";
import {Options} from '@angular-slider/ngx-slider';
import {Subject, takeUntil} from "rxjs";
import {MetaData} from "../../../model/enums";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TruckData, TruckOwner} from "../../../model/truck";
import {ManageCompany} from "../../../model/company";
import {SharedService} from 'src/app/core/services/shared/shared.service';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {CustomModalService} from "../../../services/modals/custom-modal.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {MetaDataService} from "../../../services/shared/meta-data.service";
import {OwnerData} from "../../../model/owner";

@Component({
  selector: 'app-truck-manage',
  templateUrl: './truck-manage.component.html',
  styleUrls: ['./truck-manage.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruckManageComponent implements OnInit {
  @ViewChild('note') note: ElementRef;
  @ViewChild('t2') t2: any;
  @Input() inputData: any;
  modalTitle = '';
  tireSizes: MetaData[] = [];
  truckMakers: any[] = [];
  truckTypes: any[] = [];
  truckEngines: MetaData[] = [];
  owners: TruckOwner[] = [];
  colors: MetaData[] = [];
  companyOwnedStateControl = true;
  truckForm: FormGroup;
  truck: TruckData;
  selectedTab = 1;
  isVinLoading = false;
  showNote = false;
  textRows = 1;
  selectedColor = '';
  selectedTruckType = '';
  userCompany: ManageCompany = null;
  division = 0;
  sliderOptions: Options = {
    floor: 2,
    ceil: 25,
    step: 0.5
  };
  ownerSearchItems = 0;
  tabs = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Additional'
    },
  ];
  loaded = false;
  public fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/? ]*$/;
  public numOfSpaces = 0;
  grossWeight: any;
  private destroy$: Subject<void> = new Subject<void>();
  inputText: false;

  constructor(
    private metadataService: MetaDataService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private ownerService: SharedService,
    private spinner: SpinnerService,
    //private truckService: AppTruckService,
    private customModalService: CustomModalService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private cdref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getUserCompany();
    //this.getTruckData();
    //this.createForm();

    this.ownerService.newOwner
      .pipe(takeUntil(this.destroy$))
      .subscribe((owner: OwnerData) => {
        this.owners.push({
          id: owner.id,
          divisionFlag: owner.divisionFlag,
          ownerName: owner.ownerName,
          ownerType: owner.ownerType,
        });
        this.owners = this.owners.slice(0);
        this.owners = this.owners.sort((owner) => {
          if (owner.divisionFlag > owner.divisionFlag) {
            return 1;
          }

          if (owner.divisionFlag < owner.divisionFlag) {
            return -1;
          }

          return 0;
        });
      });
  }

  getUserCompany() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
  }

  onColorChange(event: any) {
    if (event !== undefined) {
      if (event.key !== undefined) {
        if (this.selectedColor !== '') {
          document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
        }
        document
          .getElementById('colors-dropdown')
          .classList.add(event.key.replace(' ', '-').toLowerCase());
        this.selectedColor = event.key.replace(' ', '-').toLowerCase();
      } else {
        if (this.selectedColor !== '') {
          document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
        }
        document
          .getElementById('colors-dropdown')
          .classList.add(event.replace(' ', '-').toLowerCase());
        this.selectedColor = event.replace(' ', '-').toLowerCase();
      }
    } else {
      document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
      this.selectedColor = '';
    }
  }

  onTruckTypeChange(event: any) {
    if (event !== undefined) {
      if (this.selectedTruckType !== '') {
        document.getElementById('truck-type-dropdown').classList.remove(this.selectedTruckType);
      }
      document.getElementById('truck-type-dropdown').classList.add(event.class);
      this.selectedTruckType = event.class;
    } else {
      document.getElementById('truck-type-dropdown').classList.remove(this.selectedTruckType);
      this.selectedTruckType = event;
    }
  }

  /*getTruckData() {
    const tireSizes$ = this.metadataService.getMetaDataByDomainKey('tire', 'size');
    const truckEngines$ = this.metadataService.getMetaDataByDomainKey('truck', 'engine');
    const grossWeight = this.metadataService.getMetaDataByDomainKey('truck', 'gross_weight');
    const owners$ = this.truckService.getOwners();
    const truckColors$ = this.metadataService.getColorList();

    forkJoin([tireSizes$, truckEngines$, owners$, truckColors$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([tireSizes, truckEngines, owners, truckColors]: [
          MetaData[],
          MetaData[],
          TruckOwner[],
          MetaData[]
        ]) => {
          this.tireSizes = tireSizes;
          this.truckMakers = AppConst.TRUCK_MAKERS;
          this.truckTypes = AppConst.TRUCK_LIST;
          this.truckEngines = truckEngines;
          this.owners = owners.sort((owner) => {
            if (owner.divisionFlag > owner.divisionFlag) {
              return 1;
            }

            if (owner.divisionFlag < owner.divisionFlag) {
              return -1;
            }

            return 0;
          });
          this.owners.unshift({
            divisionFlag: 0,
            id: 0,
            ownerName: 'Add new',
            ownerType: null,
          });
          this.colors = truckColors;

          if (this.inputData.data.type === 'edit') {
            this.modalTitle = 'Edit Truck';
            this.truck = this.inputData.data.truck;
            // Can be simplified with next line solution
            this.companyOwnedStateControl = (this.truck && this.truck.companyOwned === 1);
            const additionalData =
              this.truck && this.truck.doc && this.truck.doc.additionalData
                ? this.truck.doc.additionalData
                : null;

            const owner = this.owners.find((o) => o.id === this.truck.ownerId);
            this.division = owner ? owner.divisionFlag : 0;
            this.loaded = true;
            this.truckForm.setValue({
              truckNumber: this.truck && this.truck.truckNumber ? this.truck.truckNumber : null,
              type: additionalData && additionalData.type ? additionalData.type : null,
              color: additionalData && additionalData.color ? additionalData.color : null,
              make: additionalData && additionalData.make ? additionalData.make : null,
              model: additionalData && additionalData.model ? additionalData.model : null,
              vin: this.truck && this.truck.vin ? this.truck.vin.toUpperCase() : null,
              note: additionalData.note !== null ? additionalData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
              owner: owner ? owner : null,
              commission:
                this.truck && this.truck.commission && !this.division
                  ? this.truck.commission
                  : null,
              mileage: additionalData && additionalData.mileage ? additionalData.mileage : null,
              ipasEzpass:
                additionalData && additionalData.ipasEzpass ? additionalData.ipasEzpass : null,
              axises: additionalData && additionalData.axises ? additionalData.axises : null,
              year: additionalData && additionalData.year ? additionalData.year : null,
              status: this.truck && this.truck.status !== null ? this.truck.status : null,
              insurancePolicyNumber:
                additionalData && additionalData.insurancePolicyNumber
                  ? additionalData.insurancePolicyNumber
                  : null,
              emptyWeight:
                additionalData && additionalData.emptyWeight ? additionalData.emptyWeight : null,
              engine: additionalData && additionalData.engine ? additionalData.engine : null,
              companyOwned: this.truck && this.truck.companyOwned ? this.truck.companyOwned : null,
              tireSize: additionalData && additionalData.tireSize ? additionalData.tireSize : null,
            });

            if (additionalData && additionalData.note && additionalData.note.length > 0) {
              this.showNote = true;
              this.handleHeight(this.truck.doc.additionalData.note);
            }
            this.shared.touchFormFields(this.truckForm);
          } else if (this.inputData.data.type === 'new') {
            // this.loaded = true;
            this.modalTitle = 'Add Truck';
            this.companyOwnedStateControl = true;
          }

          if (this.companyOwnedStateControl) {
            this.truckForm.controls.commission.setValue(0);
            this.truckForm.controls.owner.setValue(null);
            this.truckForm.controls.owner.setValidators(null);
          } else {
            this.truckForm.controls.commission.setValue(
              this.division ? 0 : this.truckForm.controls.commission.value
            );
            this.truckForm.controls.commission.setValidators(
              this.division ? null : Validators.required
            );
          }

          this.truckForm.controls.commission.updateValueAndValidity();
          this.truckForm.controls.owner.updateValueAndValidity();

          if (this.truck !== undefined) {
            setTimeout(() => {
              this.onColorChange(
                this.truck.doc.additionalData.color !== null
                  ? this.truck.doc.additionalData.color.key
                  : undefined
              );
              this.onTruckTypeChange(
                this.truck.doc.additionalData.type.class !== undefined
                  ? this.truck.doc.additionalData.type
                  : undefined
              );
            }, 500);
          }
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  } */


}
