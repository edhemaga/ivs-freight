import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// services
import { EditTagsService } from '@shared/services/edit-tags.service';
import { SettingsCompanyService } from '@pages/settings/services/settings-company.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { CaSearchMultipleStatesService } from 'ca-components';

// model
import { File } from '@shared/models/card-models/card-table-data.model';
import { FileEvent } from '@shared/models/file-event.model';
import { TableBodyOptionActions } from '@shared/components/ta-table/ta-table-body/models/table-body-option-actions.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import {
    CreateWithUploadsResponse,
    FileResponse,
} from 'appcoretruckassist/model/models';
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import {
    DocumentActionConfig,
    SettingsDocumentFilter,
} from '@pages/settings/pages/settings-document/models';

// constants
import {
    SettingsDocumentsConstants,
    SettingsDocumentFilterConstants,
} from '@pages/settings/pages/settings-document/utils/constants';

// helpers
import { MethodsGlobalHelper } from '@shared/utils/helpers';

// Enums
import { TableStringEnum } from '@shared/enums';
import { SettingsDocumentStringEnum } from '@pages/settings/pages/settings-document/enums';

@Component({
    selector: 'app-settings-document',
    templateUrl: './settings-document.component.html',
    styleUrls: ['./settings-document.component.scss'],
})
export class SettingsDocumentComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    private destroy$ = new Subject<void>();
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private tagsService: EditTagsService,
        private tableService: TruckassistTableService,
        private caSearchMultipleStatesService: CaSearchMultipleStatesService
    ) {}

    public documents: File[] = [];
    public tags: string[] = [];
    public showDropzone: boolean = false;

    public dropZoneConfig: DropZoneConfig =
        SettingsDocumentsConstants.DROPZONE_CONFIG;

    public selectedTab: string = SettingsDocumentsConstants.SELECTED_TAB;
    public tableOptions: TableBodyOptionActions =
        SettingsDocumentsConstants.INITIAL_TABLE_OPTIONS;
    public tableData = SettingsDocumentsConstants.INITIAL_TABLE_DATA;
    public resizeObserver: ResizeObserver;

    private documentActionConfig: DocumentActionConfig = {
        [SettingsDocumentStringEnum.ADD]: this.addDocument,
        [SettingsDocumentStringEnum.DELETE]: this.deleteDocument,
        [SettingsDocumentStringEnum.TAG]: this.tagDocument,
    };

    private backFilterQuery: SettingsDocumentFilter =
        SettingsDocumentFilterConstants.settingsDocumentFilterQuery;

    ngOnInit(): void {
        this.companyDocumentsGet();

        this.toolbarSearchSubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public onToolBarAction(event): void {
        if (event.action === 'open-modal') {
            this.showDropzone = true;
            this.tableOptions.toolbarActions.disableOpenModalButton = true;
        }
    }

    public hideDropzone(): void {
        this.tableOptions.toolbarActions.disableOpenModalButton = false;
        this.showDropzone = false;
    }

    public onFilesEvent(event: FileEvent): void {
        this.documentActionConfig[event.action].bind(this)(event);
    }

    private companyDocumentsGet(): void {
        this.settingsCompanyService
            .getCompanyDocuments(this.backFilterQuery)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.documents = res?.files?.data;
                this.tags = res?.tags;
                this.tableData[0].length = this.documents.length;
            });
    }

    private toolbarSearchSubscribe(): void {
        this.caSearchMultipleStatesService.currentSearchTableData
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                console.log('currentSearchTableData res', res);

                if (res) {
                    const searchEvent = MethodsGlobalHelper.tableSearch(
                        res,
                        this.backFilterQuery
                    );

                    console.log('searchEvent', searchEvent);

                    if (searchEvent) {
                        if (searchEvent.action === TableStringEnum.STORE) {
                            console.log('reset query');

                            this.backFilterQuery =
                                SettingsDocumentFilterConstants.settingsDocumentFilterQuery;
                        }

                        console.log('backFilterQuery', this.backFilterQuery);

                        this.companyDocumentsGet();
                    }
                }
            });
    }

    /**
     * Method used to add new documents.
     * It calls the service and updates the array of documents after successfull request.
     * @param event - object containing files to be added
     */
    private addDocument(event: FileEvent): void {
        const dataToSubmit = {
            files: event.files.map((file: UploadFile) => file.realFile),
        };

        this.settingsCompanyService
            .addCompanyDocuments(dataToSubmit)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: CreateWithUploadsResponse) => {
                const responseFiles: File[] = res.uploads.map(
                    (fileResponse: FileResponse) =>
                        // FileResponse should not have fileId optional
                        ({
                            ...fileResponse,
                            fileId: fileResponse!.fileId,
                        }) as File
                );

                this.documents.push(...responseFiles);
            });
        this.tableData[0].length = this.documents.length;
    }

    /**
     * Method used to delete a single document.
     * It calls the service and updates the array of documents after successfull request.
     * @param event - object containing file to be deleted
     */
    private deleteDocument(event: FileEvent): void {
        if (!event.deleteId) return;
        const dataToSubmit = {
            filesForDeleteIds: [event.deleteId],
        };

        this.settingsCompanyService
            .addCompanyDocuments(dataToSubmit)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.documents = this.documents.filter(
                    (document) => document.fileId !== event.deleteId
                );
            });
        // todo: check why tableData is array and find out if we can update it on documents change
        this.tableData[0].length = this.documents.length;
    }

    /**
     * Method used to tag or untag a single document.
     * It calls the service, but documents are being manually updated
     * inside ta-upload-files. Consider changing this
     * @param event - object containing file to be tagged, and information about tag
     */
    private tagDocument(event: FileEvent): void {
        // because of type that has set the files to be an array, we need to pop document
        // on this page, only one document can be tagged at the time
        const fileToUpdate = event.files.pop();
        const tagId =
            fileToUpdate.tagId instanceof Array
                ? fileToUpdate.tagId.pop()
                : fileToUpdate.tagId;

        const tags = [
            {
                storageId: fileToUpdate.fileId,
                tagId: tagId,
            },
        ];

        this.tagsService.updateTag({ tags: tags }).subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
