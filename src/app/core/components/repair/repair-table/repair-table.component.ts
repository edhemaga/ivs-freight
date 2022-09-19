import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RepairShopModalComponent } from '../../modals/repair-modals/repair-shop-modal/repair-shop-modal.component';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Router } from '@angular/router';
import { RepairOrderModalComponent } from '../../modals/repair-modals/repair-order-modal/repair-order-modal.component';
import { ShopQuery } from '../state/shop-state/shop.query';
import { ShopState } from '../state/shop-state/shop.store';

import { RepairTruckState } from '../state/repair-truck-state/repair-truck.store';
import { RepairTrailerState } from '../state/repair-trailer-state/repair-trailer.store';
import { RepairTruckQuery } from '../state/repair-truck-state/repair-truck.query';
import { RepairTrailerQuery } from '../state/repair-trailer-state/repair-trailer.query';
import { DatePipe } from '@angular/common';
import { RepairTService } from '../state/repair.service';
import { RepairListResponse, RepairShopListResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import { TruckassistTableService } from '../../../services/truckassist-table/truckassist-table.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import {
  tableSearch,
  closeAnimationAction,
} from '../../../utils/methods.globals';
import {
  getRepairTruckColumnDefinition,
  getRepairTrailerColumnDefinition,
  getRepairsShopColumnDefinition,
} from '../../../../../assets/utils/settings/repair-columns';

@Component({
  selector: 'app-repair-table',
  templateUrl: './repair-table.component.html',
  styleUrls: [
    './repair-table.component.scss',
    '../../../../../assets/scss/maps.scss',
  ],
  providers: [TaThousandSeparatorPipe],
})
export class RepairTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  @ViewChild('mapsComponent', { static: false }) public mapsComponent: any;

  public tableOptions: any = {};
  public tableData: any[] = [];
  public viewData: any[] = [];
  public columns: any[] = [];
  public selectedTab = 'active';
  public repairTrucks: RepairTruckState[] = [];
  public repairTrailers: RepairTrailerState[] = [];
  public repairShops: ShopState[] = [];
  resetColumns: boolean;
  tableContainerWidth: number = 0;
  resizeObserver: ResizeObserver;
  backFilterQuery = {
    repairShopId: undefined,
    repairType: undefined,
    unitType: 1,
    dateFrom: undefined,
    dateTo: undefined,
    isPM: undefined,
    pageIndex: 1,
    pageSize: 25,
    companyId: undefined,
    sort: undefined,
    searchOne: undefined,
    searchTwo: undefined,
    searchThree: undefined,
  };

  shopFilterQuery = {
    active: 1,
    pinned: undefined,
    companyOwned: undefined,
    pageIndex: 1,
    pageSize: 25,
    companyId: undefined,
    sort: undefined,
    searchOne: undefined,
    searchTwo: undefined,
    searchThree: undefined,
  };

  constructor(
    private modalService: ModalService,
    private tableService: TruckassistTableService,
    public router: Router,
    private shopQuery: ShopQuery,
    private repairTruckQuery: RepairTruckQuery,
    private repairTrailerQuery: RepairTrailerQuery,
    private repairService: RepairTService,
    public datePipe: DatePipe,
    private thousandSeparator: TaThousandSeparatorPipe,
    private reviewRatingService: ReviewsRatingService
  ) {}

  ngOnInit(): void {
    this.sendRepairData();

    // Reset Columns
    this.tableService.currentResetColumns
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if (response) {
          this.resetColumns = response;

          this.sendRepairData();
        }
      });

    // Switch Selected
    this.tableService.currentSwitchOptionSelected
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          if (res.switchType === 'PM') {
            this.router.navigate([`pm`]);
          }
        }
      });

    // Resize
    this.tableService.currentColumnWidth
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.event?.width) {
          this.columns = this.columns.map((c) => {
            if (c.title === response.columns[response.event.index].title) {
              c.width = response.event.width;
            }

            return c;
          });
        }
      });

    // Toaggle Columns
    this.tableService.currentToaggleColumn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response?.column) {
          this.columns = this.columns.map((c) => {
            if (c.field === response.column.field) {
              c.hidden = response.column.hidden;
            }

            return c;
          });
        }
      });

    // Search
    this.tableService.currentSearchTableData
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.backFilterQuery.pageIndex = 1;
          this.shopFilterQuery.pageIndex = 1;

          const searchEvent = tableSearch(
            res,
            this.selectedTab !== 'repair-shop'
              ? this.backFilterQuery
              : this.shopFilterQuery
          );

          if (searchEvent) {
            if (searchEvent.action === 'api') {
              if (this.selectedTab !== 'repair-shop') {
                this.backFilterQuery.unitType =
                  this.selectedTab === 'active' ? 1 : 2;

                this.repairBackFilter(this.backFilterQuery, true);
              } else {
                this.shopBackFilter(this.shopFilterQuery, true);
              }
            } else if (searchEvent.action === 'store') {
              this.sendRepairData();
            }
          }
        }
      });

    // Repair Actions
    this.tableService.currentActionAnimation
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        // On Add Repair
        if (res.animation === 'add' && this.selectedTab === res.tab) {
          this.viewData.push(
            res.tab === 'active'
              ? this.mapTruckData(res.data)
              : res.tab === 'inctive'
              ? this.mapTrailerData(res.data)
              : this.mapShopData(res.data)
          );

          this.viewData = this.viewData.map((repair: any) => {
            if (repair.id === res.id) {
              repair.actionAnimation = 'add';
            }

            return repair;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // On Update Repair
        else if (res.animation === 'update' && this.selectedTab === res.tab) {
          const updatedRepair =
            res.tab === 'active'
              ? this.mapTruckData(res.data)
              : res.tab === 'inctive'
              ? this.mapTrailerData(res.data)
              : this.mapShopData(res.data);

          this.viewData = this.viewData.map((repair: any) => {
            if (repair.id === res.id) {
              repair = updatedRepair;
              repair.actionAnimation = 'update';
            }

            return repair;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        }
        // On Delete Repair
        else if (res.animation === 'delete' && this.selectedTab === res.tab) {
          let repairIndex: number;

          this.viewData = this.viewData.map((repair: any, index: number) => {
            if (repair.id === res.id) {
              repair.actionAnimation = 'delete';
              repairIndex = index;
            }

            return repair;
          });

          this.updateDataCount();

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            this.viewData.splice(repairIndex, 1);
            clearInterval(inetval);
          }, 1000);
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observTableContainer();
    }, 10);
  }

  // Observ Table Container
  observTableContainer() {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.tableContainerWidth = entry.contentRect.width;
      });
    });

    this.resizeObserver.observe(document.querySelector('.table-container'));
  }

  // Repair Table Options
  public initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      toolbarActions: {
        hideLocationFilter: true,
        showMapView: this.selectedTab === 'repair-shop' ? true : false,
        viewModeActive: 'List',
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      actions: [
        {
          title: 'Edit',
          name: 'edit',
          class: 'regular-text',
          contentType: 'edit',
          show: true,
          svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
        },
        {
          title: 'Delete',
          name: 'delete-repair',
          type: !this.selectedTab ? 'repair-shop' : 'repair',
          text: !this.selectedTab
            ? 'Are you sure you want to delete repair shop(s)?'
            : 'Are you sure you want to delete repair(s)',
          class: 'delete-text',
          contentType: 'delete',
          show: true,
          danger: true,
          svg: 'assets/svg/truckassist-table/dropdown/content/delete.svg',
        },
      ],
      export: true,
    };
  }

  // Send Repair Data
  sendRepairData() {
    this.initTableOptions();

    const repairTruckTrailerCount = JSON.parse(
      localStorage.getItem('repairTruckTrailerTableCount')
    );

    const repairShopCount = JSON.parse(
      localStorage.getItem('repairShopTableCount')
    );

    const repairTruckData =
      this.selectedTab === 'active' ? this.getTabData('active') : [];

    const repairTrailerData =
      this.selectedTab === 'inactive' ? this.getTabData('inactive') : [];

    const repairShopData =
      this.selectedTab === 'repair-shop' ? this.getTabData('repair-shop') : [];

    this.tableData = [
      {
        title: 'Truck',
        field: 'active',
        length: repairTruckTrailerCount.repairTrucks,
        data: repairTruckData,
        extended: false,
        selectTab: true,
        gridNameTitle: 'Repair',
        stateName: 'repair_trucks',
        gridColumns: this.getGridColumns('repair_trucks', this.resetColumns),
      },
      {
        title: 'Trailer',
        field: 'inactive',
        length: repairTruckTrailerCount.repairTrailers,
        data: repairTrailerData,
        extended: false,
        selectTab: true,
        gridNameTitle: 'Repair',
        stateName: 'repair_trailers',
        gridColumns: this.getGridColumns('repair_trailers', this.resetColumns),
      },
      {
        title: 'Shop',
        field: 'repair-shop',
        length: repairShopCount.repairShops,
        data: repairShopData,
        extended: false,
        checkPinned: true,
        gridNameTitle: 'Repair',
        stateName: 'repair_shops',
        gridColumns: this.getGridColumns('repair_shops', this.resetColumns),
      },
    ];

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.setRepairData(td);
  }

  // Get Tab Data From Store Or Via Api
  getTabData(dataType: string) {
    if (dataType === 'active') {
      this.repairTrucks = this.repairTruckQuery.getAll();

      return this.repairTrucks?.length ? this.repairTrucks : [];
    } else if (dataType === 'inactive') {
      this.repairTrailers = this.repairTrailerQuery.getAll();
      return this.repairTrailers?.length ? this.repairTrailers : [];
    } else if (dataType === 'repair-shop') {
      this.repairShops = this.shopQuery.getAll();

      return this.repairShops?.length ? this.repairShops : [];
    }
  }

  // Get Repair Columns
  getGridColumns(stateName: string, resetColumns: boolean) {
    /*  const userState: any = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    ); */

    if (stateName === 'repair_trucks') {
      return getRepairTruckColumnDefinition();
    } else if (stateName === 'repair_trailers') {
      return getRepairTrailerColumnDefinition();
    } else if (stateName === 'repair_shops') {
      return getRepairsShopColumnDefinition();
    }
  }

  // Set Repair Data
  setRepairData(td: any) {
    this.columns = td.gridColumns;

    if (td.data.length) {
      this.viewData = td.data;

      this.viewData = this.viewData.map((data: any, index: number) => {
        if (this.selectedTab === 'active') {
          return this.mapTruckData(data);
        } else if (this.selectedTab === 'inactive') {
          return this.mapTrailerData(data);
        } else {
          return this.mapShopData(data);
        }
      });

      console.log('View Data');
      console.log(this.viewData);

      // For Testing
      // for (let i = 0; i < 300; i++) {
      //   this.viewData.push(this.viewData[0]);
      // }
    } else {
      this.viewData = [];
    }
  }

  // Map Truck Data
  mapTruckData(data: any) {
    return {
      ...data,
      isSelected: false,
      isRepairOrder: data?.repairType?.name === 'Order',
      textUnit: data?.truck?.truckNumber ? data.truck.truckNumber : '',
      textMaintenanceDate: data?.date
        ? this.datePipe.transform(data.date, 'MM/dd/yy')
        : '',
      textRepairShopName: data?.repairShop?.name ? data.repairShop.name : '',
      textTotal: data?.total
        ? '$ ' + this.thousandSeparator.transform(data.total)
        : '',
      truckDescription: data?.items
        ? data.items
            .map((item) => item.description?.trim())
            .join(
              '<div class="description-dot-container"><span class="description-dot"></span></div>'
            )
        : null,
      descriptionItems: data?.items
        ? data.items.map((item) => {
            return {
              ...item,
              descriptionPrice: item?.price
                ? '$' + this.thousandSeparator.transform(item.price)
                : '',
              descriptionTotalPrice: item?.subtotal
                ? '$' + this.thousandSeparator.transform(item.subtotal)
                : '',
              pmDescription: item.pmTruck,
            };
          })
        : null,
    };
  }

  // Map Trailer Data
  mapTrailerData(data: any) {
    return {
      ...data,
      isSelected: false,
      isRepairOrder: data?.repairType?.name === 'Order',
      textUnit: data?.trailer?.trailerNumber ? data.trailer.trailerNumber : '',
      textMaintenanceDate: data?.date
        ? this.datePipe.transform(data.date, 'MM/dd/yy')
        : '',
      textRepairShopName: data?.repairShop?.name ? data.repairShop.name : '',
      textTotal: data?.total
        ? '$ ' + this.thousandSeparator.transform(data.total)
        : '',
      trailerDescription: data?.items
        ? data.items
            .map((item) => item.description?.trim())
            .join(
              '<div class="description-dot-container"><span class="description-dot"></span></div>'
            )
        : null,
      descriptionItems: data?.items
        ? data.items.map((item) => {
            return {
              ...item,
              descriptionPrice: item?.price
                ? '$' + this.thousandSeparator.transform(item.price)
                : '',
              descriptionTotalPrice: item?.subtotal
                ? '$' + this.thousandSeparator.transform(item.subtotal)
                : '',
              pmDescription: item.pmTrailer,
            };
          })
        : null,
    };
  }

  // Map Shop Data
  mapShopData(data: any) {
    return {
      ...data,
      isSelected: false,
      textAddress: data?.address?.address ? data.address.address : '',
      shopServices: data?.serviceTypes ? data?.serviceTypes : null,
      shopRaiting: {
        hasLiked: data.currentCompanyUserRating === 1,
        hasDislike: data.currentCompanyUserRating === -1,
        likeCount: data?.upCount ? data.upCount : '0',
        dislikeCount: data?.downCount ? data.downCount : '0',
      },
    };
  }

  // Repair Back Filters
  repairBackFilter(
    filter: {
      repairShopId?: number | undefined;
      repairType?: number | undefined;
      unitType?: number | undefined;
      dateFrom?: string | undefined;
      dateTo?: string | undefined;
      isPM?: number | undefined;
      pageIndex?: number;
      pageSize?: number;
      companyId?: number | undefined;
      sort?: string | undefined;
      searchOne?: string | undefined;
      searchTwo?: string | undefined;
      searchThree?: string | undefined;
    },
    isSearch?: boolean,
    isShowMore?: boolean
  ) {
    this.repairService
      .getRepairList(
        filter.repairShopId,
        filter.repairType,
        filter.unitType,
        filter.dateFrom,
        filter.dateTo,
        filter.isPM,
        filter.pageIndex,
        filter.pageSize,
        filter.companyId,
        filter.sort,
        filter.searchOne,
        filter.searchTwo,
        filter.searchThree
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((repair: RepairListResponse) => {
        if (!isShowMore) {
          this.viewData = repair.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return filter.unitType === 1
              ? this.mapTruckData(data)
              : this.mapTrailerData(data);
          });

          if (isSearch) {
            this.tableData[this.selectedTab === 'active' ? 0 : 1].length =
              repair.pagination.count;
          }
        } else {
          let newData = [...this.viewData];

          repair.pagination.data.map((data: any) => {
            newData.push(
              filter.unitType === 1
                ? this.mapTruckData(data)
                : this.mapTrailerData(data)
            );
          });

          this.viewData = [...newData];
        }
      });
  }

  // Shop Back Filters
  shopBackFilter(
    filter: {
      active?: number;
      pinned?: boolean;
      companyOwned?: boolean;
      pageIndex?: number;
      pageSize?: number;
      companyId?: number;
      sort?: string;
      searchOne?: string | undefined;
      searchTwo?: string | undefined;
      searchThree?: string | undefined;
    },
    isSearch?: boolean,
    isShowMore?: boolean
  ) {
    this.repairService
      .getRepairShopList(
        filter.active,
        filter.pinned,
        filter.companyOwned,
        filter.pageIndex,
        filter.pageSize,
        filter.companyId,
        filter.sort,
        filter.searchOne,
        filter.searchTwo,
        filter.searchThree
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((shop: RepairShopListResponse) => {
        if (!isShowMore) {
          this.viewData = shop.pagination.data;

          this.viewData = this.viewData.map((data: any) => {
            return this.mapShopData(data);
          });

          if (isSearch) {
            this.tableData[2].length = shop.pagination.count;
          }
        } else {
          let newData = [...this.viewData];

          shop.pagination.data.map((data: any) => {
            newData.push(this.mapShopData(data));
          });

          this.viewData = [...newData];
        }
      });
  }

  // Update Data Count
  updateDataCount() {
    const repairTruckTrailerCount = JSON.parse(
      localStorage.getItem('repairTruckTrailerTableCount')
    );
    const repairShopCount = JSON.parse(
      localStorage.getItem('repairShopTableCount')
    );

    this.tableData[0].length = repairTruckTrailerCount.repairTrucks;
    this.tableData[1].length = repairTruckTrailerCount.repairTrailers;
    this.tableData[2].length = repairShopCount.repairShops;
  }

  // Table Toolbar Actions
  onToolBarAction(event: any) {
    switch (event.action) {
      case 'tab-selected': {
        this.selectedTab = event.tabData.field;

        this.backFilterQuery.pageIndex = 1;
        this.shopFilterQuery.pageIndex = 1;

        this.sendRepairData();
        break;
      }
      case 'open-modal': {
        switch (this.selectedTab) {
          case 'active': {
            this.modalService.openModal(
              RepairOrderModalComponent,
              {
                size: 'large',
              },
              {
                type: 'new-truck',
              }
            );
            break;
          }
          case 'inactive': {
            this.modalService.openModal(
              RepairOrderModalComponent,
              {
                size: 'large',
              },
              {
                type: 'new-trailer',
              }
            );
            break;
          }
          default: {
            this.modalService.openModal(RepairShopModalComponent, {
              size: 'small',
            });
            break;
          }
        }
        break;
      }
      case 'view-mode': {
        this.tableOptions.toolbarActions.viewModeActive = event.mode;

        if (event.mode == 'Map') {
          //this.mapsComponent.markersDropAnimation();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  // Table Head Actions
  onTableHeadActions(event: any) {
    if (event.action === 'sort') {
      if (event.direction) {
        this.backFilterQuery.sort = event.direction;
        this.backFilterQuery.pageIndex = 1;
        this.shopFilterQuery.pageIndex = 1;

        if (this.selectedTab !== 'repair-shop') {
          this.backFilterQuery.unitType = this.selectedTab === 'active' ? 1 : 2;

          this.repairBackFilter(this.backFilterQuery);
        } else {
          this.shopBackFilter(this.shopFilterQuery);
        }
      } else {
        this.sendRepairData();
      }
    }
  }

  // Table Body Actions
  onTableBodyActions(event: any) {
    // Show More
    if (event.type === 'show-more') {
      this.selectedTab !== 'repair-shop'
        ? this.backFilterQuery.pageIndex++
        : this.shopFilterQuery.pageIndex++;

      this.selectedTab !== 'repair-shop'
        ? this.repairBackFilter(this.backFilterQuery, false, true)
        : this.shopBackFilter(this.backFilterQuery, false, true);
    }
    // Edit
    else if (event.type === 'edit') {
      switch (this.selectedTab) {
        case 'active': {
          this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'large' },
            { ...event, type: 'edit-truck' }
          );
          break;
        }
        case 'inactive': {
          this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'large' },
            { ...event, type: 'edit-trailer' }
          );
          break;
        }
        default: {
          this.modalService.openModal(
            RepairShopModalComponent,
            { size: 'small' },
            event
          );
          break;
        }
      }
    }
    // Delete
    else if (event.type === 'delete-repair') {
      if (this.selectedTab !== 'repair-shop') {
        this.repairService
          .deleteRepairById(event.id, this.selectedTab)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      } else {
        this.repairService
          .deleteRepairShopById(event.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    }
    // Finish Order
    else if (event.type === 'finish-order') {
      switch (this.selectedTab) {
        case 'active': {
          this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'large' },
            { ...event.data, type: 'edit-fo-truck' }
          );
          break;
        }
        case 'inactive': {
          this.modalService.openModal(
            RepairOrderModalComponent,
            { size: 'large' },
            { ...event.data, type: 'edit-fo-trailer' }
          );
          break;
        }
        default: {
          break;
        }
      }
    }
    // Raiting
    else if (event.type === 'raiting') {
      let raitingData = {
        entityTypeRatingId: 2,
        entityTypeId: event.data.id,
        thumb: event.subType === 'like' ? 1 : -1,
        tableData: event.data
      };

      this.reviewRatingService
        .addRating(raitingData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.viewData = this.viewData.map((data: any) => {
            if (data.id === event.data.id) {
              data.actionAnimation = 'update';
              data.shopRaiting = {
                hasLiked: res.currentCompanyUserRating === 1,
                hasDislike: res.currentCompanyUserRating === -1,
                likeCount: res?.upCount ? res.upCount : '0',
                dislikeCount: res?.downCount ? res.downCount : '0',
              };
            }

            return data;
          });

          const inetval = setInterval(() => {
            this.viewData = closeAnimationAction(false, this.viewData);

            clearInterval(inetval);
          }, 1000);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tableService.sendActionAnimation({});
    this.tableService.sendCurrentSwitchOptionSelected(null);
    this.resizeObserver.unobserve(document.querySelector('.table-container'));
    this.resizeObserver.disconnect();
  }
}
