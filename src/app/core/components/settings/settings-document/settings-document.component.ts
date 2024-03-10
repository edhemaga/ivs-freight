import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// services
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

// model
import { File } from '../../shared/model/card-table-data.model';
import { FileEvent } from 'src/app/core/model/file-event.model';
import { DocumentAction } from './state/enum/settings-document.enum';
import { tableBodyOptions as TableBodyOptions } from '../../shared/model/tableBody';

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

    selectedTab: string = 'active';
    tableOptions: TableBodyOptions = {
        toolbarActions: {
            showArhiveFilter: false,
            viewModeOptions: [],
        },
        actions: [],
    };
    tableData: any[] = [
        {
            title: 'Document',
            field: 'active',
            length: 0,
            data: [],
            gridNameTitle: 'Document',
            tableConfiguration: null,
            isActive: true,
            gridColumns: [],
        },
    ];
    columns: any[] = [];
    resizeObserver: any;

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
    private addDocument = (event: FileEvent) => {
        let documentsToUpload = [];
        event.files.map((item) => {
            if (item.realFile && !item.alreadyUploaded) {
                item.alreadyUploaded = true;
                documentsToUpload.push(item.realFile);
            }
        });

        // todo check what should be sent.
        let newData: any = {
            files: documentsToUpload,
            filesForDeleteIds: [],
        };

        this.settingsCompanyService
            .addCompanyDocuments(newData)
            .pipe(takeUntil(this.destroy$))
            // todo add type for this response
            .subscribe((res: { id: number; uploads: File[] }) => {
                res.uploads.forEach((upload) => {
                    this.documents.push(upload);
                });
            });
        this.tableData[0].length = this.documents.length;
    };

    /**
     * Method used to delete a single document.
     * It calls the service and updates the array of documents after successfull request.
     * @param event - object containing file to be deleted
     */
    private deleteDocument = (event: FileEvent) => {
        if (event.deleteId) {
            let newData: any = {
                files: [],
                filesForDeleteIds: [event.deleteId],
            };

            this.settingsCompanyService
                .addCompanyDocuments(newData)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.documents = this.documents.filter(
                        (document) => document.fileId !== event.deleteId
                    );
                });
        }
        // todo: check why tableData is array and find out if we can update it on documents change
        this.tableData[0].length = this.documents.length;
    };

    /**
     * Method used to tag or untag a single document.
     * It calls the service, but documents are being manually updated
     * inside ta-upload-files. Consider changing this
     * @param event - object containing file to be tagged, and information about tag
     */
    private tagDocument = (event: FileEvent) => {
        let tags = [
            {
                storageId: event.files.fileId,
                tagId: event.files?.tagId?.length ? event.files.tagId[0] : null,
            },
        ];

        this.tagsService.updateTag({ tags: tags }).subscribe();
    };

    private documentActionConfig = {
        [DocumentAction.ADD]: this.addDocument,
        [DocumentAction.DELETE]: this.deleteDocument,
        [DocumentAction.TAG]: this.tagDocument,
    };

    public onFilesEvent(event: FileEvent) {
        this.documentActionConfig[event.action](event);
    }
}
