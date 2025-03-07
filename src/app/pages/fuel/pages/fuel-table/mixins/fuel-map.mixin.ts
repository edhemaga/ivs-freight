import { MapMixin } from '@shared/mixins/map/map.mixin';
import { Constructor } from '@shared/models/mixin.model';
import { FuelService } from '@shared/services/fuel.service';
import { FuelStopResponse } from 'appcoretruckassist';
import {
    IMapMarkers,
    IMapSelectedMarkerData,
    MapMarkerIconService,
    SortColumn,
} from 'ca-components';
import { takeUntil } from 'rxjs';
import { MapsService } from '@shared/services/maps.service';
import { FuelMapDropdownHelper } from '../utils/helpers/fuel-map-dropdown.helper';
import { ChangeDetectorRef } from '@angular/core';

export function FuelMapMixin<T extends Constructor>(Base: T) {
    return class extends MapMixin(Base as Constructor) {
        protected fuelService: FuelService;
        protected mapsService: MapsService;
        protected markerIconService: MapMarkerIconService;
        protected ref: ChangeDetectorRef;

        protected fuelStopMapListSortColumns: SortColumn[] = [
            {
                name: 'Business Name',
                sortName: 'name',
            },
            {
                name: 'Location',
                sortName: 'location',
                isDisabled: true,
            },
            {
                name: 'Fuel Price',
                sortName: 'cost',
            },
            {
                name: 'Last Used Date',
                sortName: 'last',
            },
            {
                name: 'Purchase Count',
                sortName: 'used',
            },
            {
                name: 'Total Expense',
                sortName: 'tableCost',
            },
        ];

        constructor(...args: any[]) {
            super(...args); // Pass all arguments to MapActionsMixin

            this.ref = args[0];
            this.fuelService = args[1];
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
                    this.mapStateFilter, // shipperStates
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

                                console.log('fuel stop data', data);

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
                                              data.favourite
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

                    console.log('mapListData', this.mapListData);
                });
        }

        protected getMarkerById(markerId: number): void {
            this.fuelService
                .getFuelStopById(markerId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res) => {
                        const fuelStopData = res;

                        console.log('fuelStopData', fuelStopData);

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
