import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// services
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

// model
import { File } from 'src/app/core/components/shared/model/card-table-data.model';
import { FileEvent } from 'src/app/core/model/file-event.model';
import { DocumentAction } from './state/enum/settings-document.enum';
import { tableBodyOptions as TableBodyOptions } from 'src/app/core/components/shared/model/tableBody';

import { UploadFile } from 'src/app/core/components/shared/ta-upload-files/ta-upload-file/ta-upload-file.component';
import {
    CreateWithUploadsResponse,
    FileResponse,
} from 'appcoretruckassist/model/models';
import { DocumentActionConfig } from 'src/app/core/model/document-action-config';

// constants
import { SettingsDocumentsConstants } from './state/constants/settings-document.constants';

@Component({
    selector: 'app-settings-document',
    templateUrl: './settings-document.component.html',
    styleUrls: ['./settings-document.component.scss'],
})
export class SettingsDocumentComponent implements OnInit {
    private destroy$ = new Subject<void>();
    constructor(
        private settingsCompanyService: SettingsCompanyService,
        private tagsService: EditTagsService,
        private tableService: TruckassistTableService
    ) {}

    public documents: File[] = [];
    public tags: string[] = [];
    public showDropzone: boolean = false;

    public selectedTab: string = SettingsDocumentsConstants.SELECTED_TAB;
    public tableOptions: TableBodyOptions =
        SettingsDocumentsConstants.INITIAL_TABLE_OPTIONS;
    public tableData = SettingsDocumentsConstants.INITIAL_TABLE_DATA;
    public resizeObserver: ResizeObserver;

    private documentActionConfig: DocumentActionConfig = {
        [DocumentAction.ADD]: this.addDocument,
        [DocumentAction.DELETE]: this.deleteDocument,
        [DocumentAction.TAG]: this.tagDocument,
    };

    ngOnInit() {
        this.companyDocumentsGet();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableService.sendCurrentSetTableWidth(
                    entry.contentRect.width
                );
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public onToolBarAction(event) {
        if (event.action === 'open-modal') {
            this.showDropzone = true;
            this.tableOptions.toolbarActions.hideOpenModalButton = true;
        }
    }

    public companyDocumentsGet() {
        this.settingsCompanyService
            .getCompanyDocuments()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.documents = res?.files?.data;
                this.tags = res?.tags;
                this.tableData[0].length = this.documents.length;
            });
    }

    public hideDropzone() {
        this.tableOptions.toolbarActions.hideOpenModalButton = false;
        this.showDropzone = false;
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
                        } as File)
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

    public onFilesEvent(event: FileEvent): void {
        this.documentActionConfig[event.action].bind(this)(event);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
