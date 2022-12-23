import { Injectable, Injector, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
interface BodyClassRequireOnInitAndOnDestroy extends OnChanges {}

interface TFunction {
    new (...args: any[]): BodyClassRequireOnInitAndOnDestroy;
}

@Injectable()
export class StaticInjectorService {
    static Injector: Injector;

    constructor(injector: Injector) {
        StaticInjectorService.Injector = injector;
    }
}

export function Titles(): <T extends TFunction>(constructor: T) => T {
    return function decorator<T extends TFunction>(constructor: T): T {
        return class extends constructor {
            pageTitle: string;
            titleChangeFnc;

            ngOnChanges(changes) {
                if (!this.pageTitle) {
                    const router = StaticInjectorService.Injector.get(Router);
                    console.log(router.url);
                    this.pageTitle = router.url.replace(/[/0-9/]/g, '');
                    console.log('WHAT IS PAGE TITLE', this.pageTitle);
                    this.titleChangeFnc = this.handleTitle(
                        `/${this.pageTitle}`
                    );
                }

                this.titleChangeFnc(changes);
                super.ngOnChanges(changes);
            }

            handleTitle(mainTitle) {
                return (changes) => {
                    handleTitleAppChange(mainTitle, changes);
                };
            }
        };
    };
}

const handleTitleAppChange = (mainTitle, changes) => {
    const appTitle = StaticInjectorService.Injector.get(Title);
    let title;
    switch (mainTitle) {
        case '/truck':
        case '/trailer':
        case '/repair':
        case '/driver':
        case '/customer':
        case '/load':
        case '/pm':
        case '/user':
        case '/fuel':
        case '/owner':
        case '/account':
        case '/contact':
            if (changes.selectedTab) {
                const selectedTab = changes.selectedTab.currentValue;
                const selectedValue = changes.tableData.currentValue.find(
                    (item) => item.field == selectedTab
                );
                title = getTitleFromValue(mainTitle, selectedValue);
            } else if (changes.viewData) {
                title = appTitle.getTitle();
                title = title.replace(
                    /\((.+?)\)/g,
                    '(' + changes.viewData.currentValue.length + ')'
                );
            }
            break;
        case '/dashboard':
            title = 'Dashboard';
            break;
        case '/truckdetails':
            if (changes.truck) {
                const truckNumber =
                    changes.truck.currentValue[0].data.truckNumber;
                title = `Unit ${truckNumber} | Truck Details`;
            }
            break;
        case '/trailerdetails':
            if (changes.trailer) {
                const trailerNumber =
                    changes.trailer.currentValue[0].data.trailerNumber;
                title = `Unit ${trailerNumber} | Trailer Details`;
            }
            break;
        case '/driverdetails':
            if (changes.drivers) {
                const driverFirstName =
                    changes.drivers.currentValue[0].data.firstName;
                const driverLast =
                    changes.drivers.currentValue[0].data.lastName;
                title = `${driverFirstName} ${driverLast} | Driver Details`;
            }
            break;
        case '/customershipper-details':
            if (changes.shipper) {
                const shipperName =
                    changes.shipper.currentValue[0].data.businessName;

                title = `${shipperName} | Shiper Details`;
            }
            break;
        case '/customerbroker-details':
            if (changes.brokerData) {
                const brokerName =
                    changes.brokerData.currentValue[0].data.businessName;

                title = `${brokerName} | Broker Details`;
            }
            break;
        case '/ads':
            if (changes.selectedDispatcher) {
                let dispatcherName =
                    changes.selectedDispatcher.currentValue.name;
                if (changes.selectedDispatcher.currentValue.id == 1) {
                    title = `Team Dispatch Board`;
                } else if (changes.selectedDispatcher.currentValue.id == -1) {
                    title = `All Dispatch Board`;
                } else {
                    title = `${dispatcherName} | Dispatch Board`;
                }
            }
            break;
    }

    if (title) appTitle.setTitle(title);
};

const getTitleFromValue = (field, value) => {
    switch (field) {
        case '/truck':
        case '/trailer':
        case '/repair':
        case '/driver':
        case '/customer':
        case '/load':
        case '/pm':
        case '/fuel':
        case '/owner':
            return `${value.gridNameTitle} | ${value.title} (${value.length})`;
        case '/account':
        case '/user':
        case '/contact':
            return `List | ${value.title} (${value.length})`;
    }
};
