import { ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs';

// mixin
import { MapMixin } from '@shared/mixins';
import { Constructor } from '@shared/models/mixin.model';

// services
import { FuelService } from '@shared/services/fuel.service';
import { MapsService } from '@shared/services/maps.service';

// models
import {
    ClusterResponse,
    FuelStopResponse,
    GetFuelStopRangeResponse,
} from 'appcoretruckassist';
import {
    IMapAreaFilter,
    IMapMarkers,
    IMapSelectedMarkerData,
    MapMarkerIconService,
    MapOptionsConstants,
    SortColumn,
} from 'ca-components';
import { IStateFilters } from '@shared/interfaces';

// helpers
import { FuelMapDropdownHelper } from '@pages/fuel/pages/fuel-table/utils/helpers/fuel-map-dropdown.helper';
import { FilterHelper, MethodsCalculationsHelper } from '@shared/utils/helpers';

// constants
import { FuelMapConstants } from '@pages/fuel/pages/fuel-table/utils/constants';

// pipes
import { LastFuelPriceRangeClassColorPipe } from '@pages/fuel/pages/fuel-stop-details/pipes';
import { MapDropdownContent } from '@ca-shared/components/ca-map-dropdown/models';

// enums
import { TableStringEnum } from '@shared/enums';

export function FuelMapMixin<T extends Constructor>(Base: T) {
    return class extends MapMixin(Base as Constructor) {
        protected fuelService: FuelService;
        protected mapsService: MapsService;
        protected markerIconService: MapMarkerIconService;
        protected ref: ChangeDetectorRef;
        protected fuelPricePipe: LastFuelPriceRangeClassColorPipe;

        protected fuelStopPriceRange: GetFuelStopRangeResponse;

        protected fuelStopMapListSortColumns: SortColumn[] =
            FuelMapConstants.FUEL_STOP_MAP_LIST_SORT_COLUMNS;

        protected areaFilterData: IMapAreaFilter | null = null;
        protected mapFiltersData: IStateFilters | null = null;
        protected isClosedFilterActive: boolean = false;

        constructor(
            ref: ChangeDetectorRef,
            fuelPricePipe: LastFuelPriceRangeClassColorPipe,
            fuelService: FuelService,
            mapsService: MapsService,
            markerIconService: MapMarkerIconService
        ) {
            super(mapsService, markerIconService); // Pass arguments to MapMixin

            this.ref = ref;
            this.fuelPricePipe = fuelPricePipe;
            this.fuelService = fuelService;
        }

        protected getClusters(
            isClusterPagination?: boolean,
            selectedMarkerId?: number
        ): void {
            if (!this.mapClustersObject) return;

            this.fuelService
                .getFuelClusters([
                    this.mapClustersObject.northEastLatitude,
                    this.mapClustersObject.northEastLongitude,
                    this.mapClustersObject.southWestLatitude,
                    this.mapClustersObject.southWestLongitude,
                    this.mapClustersObject.zoomLevel,
                    this.isAddedNewMarker, // addedNew flag
                    null, // shipperLong
                    null, // shipperLat
                    null, // shipperDistance
                    null, // shipperStates
                    null, // categoryIds?: Array<number>,
                    this.areaFilterData?.center?.lng, // _long?: number,
                    this.areaFilterData?.center?.lat, // lat?: number,
                    MethodsCalculationsHelper.convertMetersToMiles(
                        this.areaFilterData?.radius
                    ), // distance?: number,
                    this.mapFiltersData?.dueFrom, // costFrom?: number,
                    this.mapFiltersData?.dueTo, // costTo?: number,
                    this.mapFiltersData?.rateFrom, // lastFrom?: number,
                    this.mapFiltersData?.rateTo, // lastTo?: number,
                    this.mapFiltersData?.paidFrom, // ppgFrom?: number,
                    this.mapFiltersData?.paidTo, // ppgTo?: number,
                    this.mapsService.selectedMarkerId ?? null, // selectedId
                    this.isClosedFilterActive ? 0 : 1, // active
                    this.mapClustersPagination.pageIndex, // pageIndex
                    this.mapClustersPagination.pageSize, // pageSize
                    null, // companyId
                    this.mapListSortDirection ?? null, // sortBy
                    null, // sortOrder
                    null, // sortBy
                    this.mapListSearchValue, // search
                    null, // search1
                    null, // search2
                ])
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse) => {
                    if (isClusterPagination)
                        this.handleClustersSelectedMarkerPagination(
                            clustersResponse
                        );
                    else this.handleClustersResponse(clustersResponse);

                    if (this.isAddedNewMarker) this.isAddedNewMarker = false;

                    if (selectedMarkerId) this.getMarkerById(selectedMarkerId);

                    this.ref.detectChanges();
                });
        }

        protected getMapList(): void {
            if (!this.mapClustersObject) return;

            this.fuelService
                .getFuelMapList([
                    this.mapClustersObject.northEastLatitude,
                    this.mapClustersObject.northEastLongitude,
                    this.mapClustersObject.southWestLatitude,
                    this.mapClustersObject.southWestLongitude,
                    this.areaFilterData?.center?.lng, // _long?: number,
                    this.areaFilterData?.center?.lat, // lat?: number,
                    MethodsCalculationsHelper.convertMetersToMiles(
                        this.areaFilterData?.radius
                    ), // distance?: number,
                    this.mapFiltersData?.rateFrom, // lastFrom?: number,
                    this.mapFiltersData?.rateTo, // lastTo?: number,
                    this.mapFiltersData?.dueFrom, // costFrom?: number,
                    this.mapFiltersData?.dueTo, // costTo?: number,
                    this.mapFiltersData?.paidFrom, // ppgFrom?: number,
                    this.mapFiltersData?.paidTo, // ppgTo?: number,
                    this.mapListPagination.pageIndex,
                    this.mapListPagination.pageSize,
                    null, // companyId
                    this.mapListSortDirection ?? null, // sort
                    null, // sortOrder
                    null, // sortBy
                    this.mapListSearchValue, // search
                    null, // search1
                    null, // search2
                ])
                .pipe(takeUntil(this.destroy$))
                .subscribe((mapListResponse) => {
                    const mappedListData = mapListResponse?.pagination?.data;

                    this.mapListCount = mapListResponse.pagination.count;

                    this.mapListData =
                        this.mapListPagination.pageIndex > 1
                            ? [...this.mapListData, ...mappedListData]
                            : mappedListData;

                    this.ref.detectChanges();
                });
        }

        protected getMarkerById(markerId: number): void {
            this.fuelService
                .getFuelStopById(markerId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        this.handleFuelStopResponse(res, markerId);

                        this.ref.detectChanges();
                    },
                    error: () => {},
                });
        }

        protected handleClustersResponse(
            clustersResponse: ClusterResponse[]
        ): void {
            const clusterMarkers: IMapMarkers[] = [];
            const markers: IMapMarkers[] = [];

            clustersResponse?.forEach((data) => {
                const previousClusterData = this.findPreviousClusterData(data);
                const previousMarkerData = this.findPreviousMarkerData(data);

                let clusterInfoWindowContent = this.getClusterInfoWindowContent(
                    data,
                    previousClusterData
                );

                const newMarkerData =
                    previousClusterData || previousMarkerData
                        ? this.updateExistingMarker(
                              previousClusterData,
                              previousMarkerData,
                              clusterInfoWindowContent
                          )
                        : this.createNewFuelStopMarker(
                              data,
                              clusterInfoWindowContent
                          );

                if (data.count > 1) clusterMarkers.push(newMarkerData);
                else markers.push(newMarkerData);
            });

            this.mapData = {
                ...this.mapData,
                clusterMarkers,
                markers,
            };
        }

        protected handleFuelStopResponse(
            fuelStopData: FuelStopResponse,
            selectedMarkerId: number
        ): void {
            const selectedMarkerData: IMapSelectedMarkerData | null =
                this.getSelectedMarkerData(fuelStopData, selectedMarkerId);

            this.mapsService.selectedMarker(
                selectedMarkerData ? fuelStopData.id : null
            );

            this.mapData = { ...this.mapData, selectedMarkerData };
        }

        protected createNewFuelStopMarker(
            data: ClusterResponse,
            clusterInfoWindowContent: MapDropdownContent
        ): IMapMarkers {
            let markerData: IMapMarkers = {
                position: {
                    lat: data.latitude,
                    lng: data.longitude,
                },
                infoWindowContent: clusterInfoWindowContent,
                label: data.name,
                isFavorite: data.favourite,
                isClosed: data.isClosed,
                id: data.id,
                data,
            };

            const fuelMarkerClass = this.fuelPricePipe.transform({
                minValue: this.fuelStopPriceRange.dieselMin,
                maxValue: this.fuelStopPriceRange.dieselMax,
                totalValue: data.pricePerGallon,
                isOutdated: data.isOutdated,
            });

            const markerIcon =
                data.count > 1
                    ? this.markerIconService.getClusterMarkerIcon(
                          markerData,
                          true
                      )
                    : this.markerIconService.getMarkerIcon(
                          data.id,
                          data.name,
                          data.isClosed,
                          data.favourite,
                          false,
                          fuelMarkerClass,
                          data.pricePerGallon ? '$' + data.pricePerGallon : null
                      );

            markerData = {
                ...markerData,
                content: markerIcon,
            };

            return markerData;
        }

        protected getSelectedMarkerData(
            fuelStopData: FuelStopResponse,
            selectedMarkerId: number
        ): IMapSelectedMarkerData {
            const selectedClusterMarker = this.mapData.clusterMarkers.find(
                (clusterMarker) =>
                    clusterMarker.data.pagination?.data?.some(
                        (clusterItem) => clusterItem.id === selectedMarkerId
                    )
            );

            if (selectedClusterMarker)
                return {
                    ...selectedClusterMarker,
                    infoWindowContent: {
                        ...selectedClusterMarker.infoWindowContent,
                        selectedClusterItemData: {
                            ...FuelMapDropdownHelper.getFuelMapDropdownConfig(
                                fuelStopData,
                                true
                            ),
                            data: fuelStopData,
                        },
                    },
                };
            else {
                const markerData = this.mapData.markers.find(
                    (marker) => marker.data?.id === selectedMarkerId
                );

                if (markerData) {
                    return {
                        ...markerData,
                        infoWindowContent:
                            FuelMapDropdownHelper.getFuelMapDropdownConfig(
                                fuelStopData
                            ),
                        data: fuelStopData,
                    };
                }
            }
        }

        protected handleMapFilters(currentFilter): void {
            switch (currentFilter.filterType) {
                case TableStringEnum.LOCATION_FILTER:
                    this.areaFilterData = currentFilter.queryParams && {
                        ...MapOptionsConstants.AREA_FILTER_DATA,
                        center: {
                            lat: currentFilter.queryParams.latValue,
                            lng: currentFilter.queryParams.longValue,
                        },
                        radius: MethodsCalculationsHelper.convertMilesToMeters(
                            currentFilter.queryParams.rangeValue
                        ),
                    };

                    this.mapData = {
                        ...this.mapData,
                        areaFilterData: this.areaFilterData,
                    };

                    break;

                case TableStringEnum.MONEY_FILTER:
                    this.mapFiltersData = FilterHelper.mapFilters(
                        currentFilter,
                        this.mapFiltersData
                    );

                    break;

                // TO DO: FUEL STOP FILTER
                // case TableStringEnum.FUEL_STOP_FILTER:
                //     break;
            }

            if (currentFilter.filterName === TableStringEnum.CLOSED_ARRAY)
                this.isClosedFilterActive = currentFilter.selectedFilter;

            this.isAddedNewMarker = true;

            this.getClusters();
            this.getMapList();
        }
    };
}
