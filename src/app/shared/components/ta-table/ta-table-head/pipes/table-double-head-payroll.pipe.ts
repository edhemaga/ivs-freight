import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHeadPayroll', standalone: true })
export class TableDoubleHeadPayrollPipe implements PipeTransform {
    transform(tableHeadTitle: string): string {
        const match = tableHeadTitle.match(/(.*) \((.*)\)/);

        if (!match) {
            return tableHeadTitle;
        }

        const mainPart = match[1].trim();
        const spanPart = match[2].trim().toLowerCase();

        return `<p class="m-0 payroll-solo-team">
                    ${mainPart} 
                        <span>
                            (${spanPart})
                        </span>
                </p>`;
    }
}
