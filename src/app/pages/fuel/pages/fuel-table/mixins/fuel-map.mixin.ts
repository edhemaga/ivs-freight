import { ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs';

// mixin
import { MapMixin } from '@shared/mixins';
import { Constructor } from '@shared/models/mixin.model';

// services
import { FuelService } from '@shared/services/fuel.service';
import { MapsService } from '@shared/services/maps.service';

// models
import { GetFuelStopRangeResponse } from 'appcoretruckassist';
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
            fuelService: FuelService,
            fuelPricePipe: LastFuelPriceRangeClassColorPipe,
            mapsService: MapsService,
            markerIconService: MapMarkerIconService
        ) {
            super(mapsService, markerIconService); // Pass arguments to MapMixin

            this.ref = ref;
            this.fuelService = fuelService;
            this.fuelPricePipe = fuelPricePipe;
        }

        protected getClusters(
            isClusterPagination?: boolean,
            selectedMarkerId?: number
        ): void {
            if (!this.mapClustersObject) return;

            this.fuelService
                .getFuelClusters(
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
                    null, // search
                    null, // search1
                    null // search2
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe((clustersResponse) => {
                    if (isClusterPagination) {
                        let selectedMarkerData: IMapMarkers | null = {
                            ...this.mapData.selectedMarkerData,
                        };

                        const findClusterData = clustersResponse.find(
                            (data) =>
                                this.mapData.selectedMarkerData?.position
                                    ?.lat === data.latitude &&
                                this.mapData.selectedMarkerData?.position
                                    .lng === data.longitude
                        );

                        if (findClusterData) {
                            selectedMarkerData = {
                                ...selectedMarkerData,
                                infoWindowContent: {
                                    ...selectedMarkerData.infoWindowContent,
                                    clusterData: [
                                        ...selectedMarkerData.infoWindowContent
                                            .clusterData,
                                        ...findClusterData.pagination.data,
                                    ],
                                },
                            };
                        }

                        this.mapData = {
                            ...this.mapData,
                            selectedMarkerData,
                        };
                    } else {
                        const clusterMarkers: IMapMarkers[] = [];
                        const markers: IMapMarkers[] = [];

                        clustersResponse?.forEach((data) => {
                            const previousClusterData =
                                this.mapData.clusterMarkers.find(
                                    (item) =>
                                        item.position.lat === data.latitude &&
                                        item.position.lng === data.longitude
                                );

                            const previousMarkerData =
                                this.mapData.markers.find(
                                    (item2) =>
                                        item2.position.lat === data.latitude &&
                                        item2.position.lng === data.longitude
                                );

                            let clusterInfoWindowContent = data.pagination?.data
                                ? {
                                      clusterData: [...data.pagination.data],
                                      selectedClusterItemData: null,
                                  }
                                : null;

                            if (
                                previousClusterData?.infoWindowContent
                                    ?.selectedClusterItemData
                            ) {
                                clusterInfoWindowContent = {
                                    ...clusterInfoWindowContent,
                                    selectedClusterItemData:
                                        previousClusterData?.infoWindowContent
                                            ?.selectedClusterItemData,
                                };
                            }

                            if (previousClusterData || previousMarkerData) {
                                const newMarkerData = {
                                    ...(previousMarkerData ||
                                        previousClusterData),
                                    infoWindowContent: clusterInfoWindowContent,
                                };

                                if (data.count > 1)
                                    clusterMarkers.push(newMarkerData);
                                else markers.push(newMarkerData);
                            } else {
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

                                const fuelMarkerClass =
                                    this.fuelPricePipe.transform({
                                        minValue:
                                            this.fuelStopPriceRange.dieselMin,
                                        maxValue:
                                            this.fuelStopPriceRange.dieselMax,
                                        totalValue: data.pricePerGallon,
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
                                              data.pricePerGallon
                                                  ? '$' + data.pricePerGallon
                                                  : null
                                          );

                                markerData = {
                                    ...markerData,
                                    content: markerIcon,
                                };

                                if (data.count > 1)
                                    clusterMarkers.push(markerData);
                                else markers.push(markerData);
                            }
                        });

                        this.mapData = {
                            ...this.mapData,
                            clusterMarkers,
                            markers,
                        };
                    }

                    if (this.isAddedNewMarker) this.isAddedNewMarker = false;

                    if (selectedMarkerId) this.getMarkerById(selectedMarkerId);

                    this.ref.detectChanges();
                });
        }

        protected getMapList(): void {
            if (!this.mapClustersObject) return;

            this.fuelService
                .getFuelMapList(
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
                    this.mapListSearchValue, // search
                    null, // search1
                    null // search2
                )
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
                        const fuelStopData = res;

                        let selectedMarkerData: IMapSelectedMarkerData | null =
                            null;

                        this.mapData.clusterMarkers.forEach((clusterMarker) => {
                            const clusterItemIndex =
                                clusterMarker.data.pagination?.data?.findIndex(
                                    (clusterItem) => clusterItem.id === markerId
                                );

                            if (clusterItemIndex > -1) {
                                selectedMarkerData = {
                                    ...clusterMarker,
                                    infoWindowContent: {
                                        ...clusterMarker.infoWindowContent,
                                        selectedClusterItemData: {
                                            ...FuelMapDropdownHelper.getFuelMapDropdownConfig(
                                                fuelStopData,
                                                true
                                            ),
                                            data: fuelStopData,
                                        },
                                    },
                                };
                            }
                        });

                        const markerData = this.mapData.markers.find(
                            (marker) => marker.data?.id === markerId
                        );

                        if (markerData)
                            selectedMarkerData = {
                                ...markerData,
                                infoWindowContent:
                                    FuelMapDropdownHelper.getFuelMapDropdownConfig(
                                        fuelStopData
                                    ),
                                data: fuelStopData,
                            };

                        this.mapsService.selectedMarker(
                            selectedMarkerData ? fuelStopData.id : null
                        );

                        this.mapData = { ...this.mapData, selectedMarkerData };

                        this.ref.detectChanges();
                    },
                    error: () => {},
                });
        }
    };
}
