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
    IMapMarkers,
    IMapSelectedMarkerData,
    MapMarkerIconService,
    SortColumn,
} from 'ca-components';

// helpers
import { FuelMapDropdownHelper } from '@pages/fuel/pages/fuel-table/utils/helpers/fuel-map-dropdown.helper';

// constants
import { FuelMapConstants } from '@pages/fuel/pages/fuel-table/utils/constants';

// pipes
import { LastFuelPriceRangeClassColorPipe } from '@pages/fuel/pages/fuel-stop-details/pipes';
import { MapDropdownContent } from '@ca-shared/components/ca-map-dropdown/models';

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
                    null, // _long?: number,
                    null, // lat?: number,
                    null, // distance?: number,
                    null, // costFrom?: number,
                    null, // costTo?: number,
                    null, // lastFrom?: number,
                    null, // lastTo?: number,
                    null, // ppgFrom?: number,
                    null, // ppgTo?: number,
                    this.mapsService.selectedMarkerId ?? null, // selectedId
                    null, // active
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
                    null, // _long?: number,
                    null, // lat?: number,
                    null, // distance?: number,
                    null, // lastFrom?: number,
                    null, // lastTo?: number,
                    null, // costFrom?: number,
                    null, // costTo?: number,
                    null, // ppgFrom?: number,
                    null, // ppgTo?: number,
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
    };
}
