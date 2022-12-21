import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';

@Component({
    selector: 'app-settings-document',
    templateUrl: './settings-document.component.html',
    styleUrls: ['./settings-document.component.scss'],
})
export class SettingsDocumentComponent implements OnInit {
    @ViewChild('uploadFiles', { static: false }) public uploadFiles: any;
    private destroy$ = new Subject<void>();
    constructor(private settingsCompanyService: SettingsCompanyService) {}

    public documents: any = [];
    public showDropzone: boolean = false;
    selectedTab: string = 'active';
    tableOptions: any = {
        toolbarActions: {
            showArhiveFilter: true,
            viewModeOptions: [],
        },
        actions: [],
    };
    tableData: any[] = [{
        title: 'Document',
        field: 'active',
        length: 0,
        data: [],
        gridNameTitle: 'Document',
        tableConfiguration: null,
        isActive: true,
        gridColumns: [],
    }];
    viewData: any[] = [];
    columns: any[] = [];
    resizeObserver: any;
    tableContainerWidth: number = 1832;

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
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public onToolBarAction(event) {
        if (event.action === 'open-modal') {
            this.showDropzone = true;
            this.tableOptions.toolbarActions.hideOpenModalButton = true
        }
    }

    public companyDocumentsGet() {
        this.settingsCompanyService
        .getCompanyDocuments()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res)=>{
            this.documents = res?.files?.data;
            this.tableData[0].length = this.documents.length;
        });
    }

    public hideDropzone() {
        this.tableOptions.toolbarActions.hideOpenModalButton = false;
        this.showDropzone = false;
    }

    public onFilesEvent(event: any) {
        //this.documents = event.files;
        this.tableData[0].length = event.files.length;
        switch (event.action) {
            case 'add': {
                let documents = [];
                event.files.map((item) => {
                    if (item.realFile) {
                        documents.push(item.realFile);
                    }
                });

                let newData: any = {
                    files: documents,
                    filesForDeleteIds: []
                }

                this.settingsCompanyService
                .addCompanyDocuments(newData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: any)=>{
                    if(this.uploadFiles?.files?.length) {
                        this.uploadFiles.files.map((item, index)=>{
                            res.uploads.map((upl, indx)=>{
                                if (item.realFile?.name == upl.fileName) {
                                    item.fileId = upl.fileId;
                                }
                            });
                        });
                    }
                });
                break;
            }
            case 'delete': {
                if (event.deleteId) {
                    let newData: any = {
                        files: [],
                        filesForDeleteIds: [event.deleteId]
                    }
    
                    this.settingsCompanyService
                    .addCompanyDocuments(newData)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe();
                }
                break;
            }
            default: {
                break;
            }
        }
    }
}
