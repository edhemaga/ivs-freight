import { Constructor } from '@shared/models/mixin.model';
import { DestroyableMixin } from '../destroyable.mixin';

import { takeUntil } from 'rxjs';

// models
import { MapList } from '@pages/repair/pages/repair-table/models';
import {
    ICaMapProps,
    MapOptionsConstants,
    IMapPagination,
    IMapBounds,
    SortColumn,
    IMapMarkers,
    IMapBoundsZoom,
    IMapSelectedMarkerData,
    MapMarkerIconService,
} from 'ca-components';
import { MapsService } from '@shared/services/maps.service';

interface HasMapData {
    getClusters(isClusterPagination?: boolean, selectedMarkerId?: number): void;
    getMapList(): void;
    getMarkerById(): void;
}

export function MapMixin<T extends Constructor>(Base: T) {
    return class extends DestroyableMixin(Base) {
        protected mapListSortColumns: SortColumn[];

        protected mapListData: MapList[] = [];

        protected mapData: ICaMapProps = MapOptionsConstants.defaultMapConfig;
        protected mapListPagination: IMapPagination =
            MapOptionsConstants.mapListPagination;
        protected mapClustersPagination: IMapPagination =
            MapOptionsConstants.mapListPagination;
        protected mapClustersObject: IMapBounds = null;
        protected mapListSearchValue: string | null = null;
        protected mapListSortDirection: string | null = null;
        protected isAddedNewMarker: boolean = false;
        protected mapStateFilter: string[] | null = null;
        protected isSelectedFromMapList: boolean = false;
        protected mapListCount: number = 0;
        protected isSelectedFromDetails: boolean = false;

        protected mapsService: MapsService;
        protected markerIconService: MapMarkerIconService;

        protected getClusters(
            isClusterPagination?: boolean,
            selectedMarkerId?: number
        ): void {} // Declaring the getClusters method
        protected getMapList(): void {} // Declaring the getMapList method
        protected getMarkerById(markerId: number): void {} // Declaring the getMarkerById method

        constructor(...args: any[]) {
            super(...args); // Forward constructor arguments

            this.mapsService = args[2];
            this.markerIconService = args[3];
        }

        protected onMapListSearch(search: string): void {
            this.mapListSearchValue = search;

            this.mapListPagination = {
                ...this.mapListPagination,
                pageIndex: 1,
            };

            this.getMapList();
        }

        protected onMapListSort(sortDirection: string): void {
            this.mapListSortDirection = sortDirection;

            this.getMapList();
        }

        protected onClusterMarkerClick(selectedMarker: IMapMarkers): void {
            if (this.mapsService.selectedMarkerId)
                this.onResetSelectedMarkerItem();

            const selectedMarkerData: IMapSelectedMarkerData | null =
                this.mapData.clusterMarkers.find(
                    (clusterMarker) =>
                        clusterMarker.position.lat ===
                            selectedMarker.position.lat &&
                        clusterMarker.position.lng ===
                            selectedMarker.position.lng
                ) ?? null;

            this.mapData = { ...this.mapData, selectedMarkerData };
        }

        protected onClusterListScroll(clusterMarker: IMapMarkers): void {
            if (
                clusterMarker?.data?.count /
                    this.mapClustersPagination.pageIndex >
                25
            ) {
                this.mapClustersPagination = {
                    ...this.mapClustersPagination,
                    pageIndex: this.mapClustersPagination.pageIndex + 1,
                };

                this.getClusters(true);
            }
        }

        protected onGetInfoWindowData(
            markerId: number,
            isFromMapList?: boolean
        ): void {
            this.mapsService.selectedMarker(markerId);

            this.isSelectedFromMapList = isFromMapList;

            this.getMapData(false, markerId);
        }

        protected onMapBoundsChange(event: IMapBoundsZoom): void {
            const ne = event.bounds.getNorthEast(); // LatLng of the north-east corner
            const sw = event.bounds.getSouthWest(); // LatLng of the south-west corder

            this.mapClustersObject = {
                northEastLatitude: parseFloat(ne.lat().toFixed(6)),
                northEastLongitude: parseFloat(ne.lng().toFixed(6)),
                southWestLatitude: parseFloat(sw.lat().toFixed(6)),
                southWestLongitude: parseFloat(sw.lng().toFixed(6)),
                zoomLevel: event.zoom,
            };

            if (this.isSelectedFromDetails) {
                this.onGetInfoWindowData(this.mapsService.selectedMarkerId);
                this.isSelectedFromDetails = false;
            } else this.getMapData();
        }

        protected onResetSelectedMarkerItem(isBackButton?: boolean): void {
            const selectedMarkerData = isBackButton
                ? {
                      ...this.mapData.selectedMarkerData,
                      infoWindowContent: {
                          ...this.mapData.selectedMarkerData.infoWindowContent,
                          selectedClusterItemData: null,
                      },
                  }
                : null;

            this.mapData = {
                ...this.mapData,
                selectedMarkerData,
            };

            this.isSelectedFromMapList = false;

            this.mapsService.selectedMarker(null);

            this.getClusters();

            this.getMapList();
        }

        protected getMapData(
            isClusterPagination?: boolean,
            selectedMarkerId?: number
        ): void {
            this.mapListPagination = {
                ...this.mapListPagination,
                pageIndex: 1,
            };

            this.mapClustersPagination = {
                ...this.mapClustersPagination,
                pageIndex: 1,
            };

            this.getClusters(isClusterPagination, selectedMarkerId);

            this.getMapList();
        }

        protected addMapListScrollEvent(): void {
            this.mapsService.mapListScrollChange
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    const isNewPage =
                        this.mapListCount / this.mapListPagination.pageIndex >
                        25;

                    if (isNewPage) {
                        this.mapListPagination = {
                            ...this.mapListPagination,
                            pageIndex: this.mapListPagination.pageIndex + 1,
                        };

                        this.getMapList();
                    }
                });
        }

        protected addSelectedMarkerListener(): void {
            this.mapsService.selectedMapListCardChange
                .pipe(takeUntil(this.destroy$))
                .subscribe((id) => {
                    if (id) this.onGetInfoWindowData(id, true);
                    else this.onResetSelectedMarkerItem();
                });
        }

        protected updateMapItem(item?): void {
            this.isAddedNewMarker = true;

            this.getMapData();

            if (item) this.mapsService.markerUpdate(item);
        }

        protected checkSelectedMarker(): void {
            const isAlreadySelectedMarker =
                this.mapData?.selectedMarkerData?.data?.id ===
                this.mapsService.selectedMarkerId;

            if (this.mapsService.selectedMarkerId && !isAlreadySelectedMarker)
                this.isSelectedFromDetails = true;
        }
    };
}
