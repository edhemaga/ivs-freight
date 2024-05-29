import { DriverResponse } from 'appcoretruckassist';

export class DriverColumnsHelper {
    static getDriverPayrollColumns(tableData: DriverResponse[]) {
        const soloPayrollProperties: string[] = [];
        const teamPayrollProperties: string[] = [];

        tableData.forEach((driver) => {
            const { solo, team } = driver;

            const soloPayroll = Object.entries(solo);
            const teamPayroll = Object.entries(team);

            soloPayroll.forEach((payroll) => {
                const modifiedPayroll = payroll[0] + 'Solo';

                if (
                    payroll[1] &&
                    !soloPayrollProperties.includes(modifiedPayroll)
                ) {
                    soloPayrollProperties.push(modifiedPayroll);
                }
            });

            teamPayroll.forEach((payroll) => {
                const modifiedPayroll = payroll[0] + 'Team';

                if (
                    payroll[1] &&
                    !teamPayrollProperties.includes(modifiedPayroll)
                ) {
                    teamPayrollProperties.push(modifiedPayroll);
                }
            });
        });

        const mergedSoloAndTeamPayrollProperties = this.mergePayrolls(
            soloPayrollProperties,
            teamPayrollProperties
        );

        return this.getDriverPayrollColumnsDefinition(
            mergedSoloAndTeamPayrollProperties
        );
    }

    static getDriverPayrollColumnsDefinition(payrollProperties: string[]) {
        const payrollColumns = [];

        payrollProperties.forEach((property, index) => {
            const payrollColumn = {
                ngTemplate: 'text',
                title: this.createSingleColumnProperties(property, 'title'),
                field: property,
                name: this.createSingleColumnProperties(property, 'name'),
                groupName: 'Payroll Detail ',
                hidden: true,
                isPined: false,
                sortName: '',
                width: this.createSingleColumnProperties(property, 'width'),
                minWidth: this.createSingleColumnProperties(property, 'width'),
                filter: '',
                isNumeric: true,
                isDate: false,
                index: index + 12,
                sortable: true,
                isActionColumn: false,
                isSelectColumn: false,
                avatar: null,
                progress: null,
                hoverTemplate: null,
                filterable: true,
                disabled: false,
                export: true,
                resizable: true,
                class: 'custom-font',
            };

            payrollColumns.push(payrollColumn);
        });

        return payrollColumns;
    }

    static mergePayrolls(
        soloPayroll: string[],
        teamPayroll: string[]
    ): string[] {
        const order = [
            'emptyMile',
            'loadedMile',
            'perStop',
            'flatRate',
            'commission',
        ];

        const result: string[] = [];

        order.forEach((item) => {
            const soloItem = soloPayroll.find((element) =>
                element.includes(item + 'Solo')
            );
            const teamItem = teamPayroll.find((element) =>
                element.includes(item + 'Team')
            );

            if (soloItem) result.push(soloItem);
            if (teamItem) result.push(teamItem);
        });

        return result;
    }

    static createSingleColumnProperties(
        property: string,
        type: string
    ): string | number {
        let conditionalProperty: string | number;

        switch (type) {
            case 'title':
                conditionalProperty =
                    this.createPayrollTitleProperties(property);

                break;
            case 'name':
                conditionalProperty =
                    this.createPayrollNameProperties(property);

                break;
            case 'width':
                conditionalProperty =
                    this.createPayrollWidthProperties(property);

                break;

            default:
                break;
        }

        return conditionalProperty;
    }

    static createPayrollTitleProperties(property: string): string {
        let conditionalProperty: string;

        if (property.includes('Solo')) {
            switch (true) {
                case property.includes('empty'):
                    conditionalProperty = 'EMPTY (s)';

                    break;
                case property.includes('loaded'):
                    conditionalProperty = 'LOADED (s)';

                    break;
                case property.includes('Stop'):
                    conditionalProperty = 'STOP (s)';

                    break;
                case property.includes('flat'):
                    conditionalProperty = 'FLAT RATE (s)';

                    break;
                case property.includes('commission'):
                    conditionalProperty = 'COMM (s)';

                    break;
                default:
                    break;
            }
        } else {
            switch (true) {
                case property.includes('empty'):
                    conditionalProperty = 'EMPTY (t)';

                    break;
                case property.includes('loaded'):
                    conditionalProperty = 'LOADED (t)';

                    break;
                case property.includes('Stop'):
                    conditionalProperty = 'STOP (t)';

                    break;
                case property.includes('flat'):
                    conditionalProperty = 'FLAT RATE (t)';

                    break;
                case property.includes('commission'):
                    conditionalProperty = 'COMM (t)';

                    break;

                default:
                    break;
            }
        }

        return conditionalProperty;
    }

    static createPayrollNameProperties(property: string): string {
        // Split the string into parts based on known substrings
        let soloOrTeam = '';
        let type = '';

        if (property.includes('Solo')) {
            soloOrTeam = 'Solo';

            type = property.replace('Solo', '');
        } else if (property.includes('Team')) {
            soloOrTeam = 'Team';

            type = property.replace('Team', '');
        }

        // Convert camelCase to space-separated words
        const formattedType = type.replace(/([a-z])([A-Z])/g, '$1 $2');

        // Capitalize the first letter of each word
        const capitalizedType = formattedType.replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );

        return `${capitalizedType} - ${soloOrTeam}`;
    }

    static createPayrollWidthProperties(property: string): number {
        return property.includes('flat')
            ? 101
            : property.includes('loaded')
            ? 88
            : 78;
    }
}
