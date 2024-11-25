// Modules
import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// Services
import { PayrollService } from '@pages/accounting/pages/payroll/services/payroll.service';

// Components
import { CaModalComponent } from 'ca-components';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// Utils
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

// Models
import { PayrollModal } from '@pages/accounting/pages/payroll/state/models';

const ZOOM_STEP: number = 0.2;
const DEFAULT_ZOOM: number = 1;
const MAX_ZOOM: number = 2;

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        PdfViewerModule,

        CaModalComponent,
        TaSpinnerComponent,
    ],
})
export class PayrollReportComponent implements OnInit {
    @Input() editData: PayrollModal;
    public pdfSrc: string | ArrayBuffer | undefined;
    public pdfBlob: Blob | undefined;
    public svgRoutes = PayrollSvgRoutes;
    public maxZoom: number = MAX_ZOOM;

    public pdfZoom: number = DEFAULT_ZOOM;
    public isLoading = true;
    constructor(
        private payrollService: PayrollService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        if (!this.editData.data?.id) {
            console.error('Report id is required');
            return;
        }

        if (!this.editData.data?.type) {
            console.error('Report type is required');
            return;
        }

        this.getReportById();
    }

    private getReportById(): void {
        this.payrollService
            .generateReport(this.editData.data.id, this.editData.data.type)
            .subscribe({
                next: (response: Blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // Store data for rendering PDF
                        this.pdfSrc = reader.result;
                        // Store Blob for download
                        this.pdfBlob = response;
                        this.isLoading = false;
                    };
                    reader.readAsArrayBuffer(response);
                },
                error: (error) => {
                    console.error('Error loading the PDF:', error);
                },
            });
    }

    public downloadReport(): void {
        if (this.pdfBlob) {
            const blobUrl = URL.createObjectURL(this.pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Report-${this.editData.data.type}-${this.editData.data.id}.pdf`;
            link.click();
            URL.revokeObjectURL(blobUrl);
        }
    }

    public zoomIn() {
        if (this.pdfZoom < MAX_ZOOM) {
            this.pdfZoom += ZOOM_STEP;
        }
    }

    public zoomOut() {
        if (this.pdfZoom > DEFAULT_ZOOM) {
            this.pdfZoom -= ZOOM_STEP;
        }
    }

    public resetZoom() {
        this.pdfZoom = DEFAULT_ZOOM;
    }

    public onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
