import { inject } from 'aurelia-framework';
import { SearchEventAggregator } from './search-event-aggregator';
import { VehiclesGateway } from 'gateways/vehicles-gateway';
import { FiltersModel } from 'models/filters-model';
import { VehiclesModel } from 'models/vehicles-model';

@inject(SearchEventAggregator, VehiclesGateway)
export class Index {
    /*
    * Defines
    * */
    filterEventAggregator;
    filters = new FiltersModel();
    vehicles;
    vehiclesToShow = [];
    paging;
    vehiclesToShowCached = [];
    debounceFilters;
    loading = true;
    firstLoad = true;
    currentPage = 1;
    refVehicleDetails;


    /*
    * Lifecycle Methods
    * */
    constructor(filterEventAggregator, vehiclesGateway) {
        this.filterEventAggregator = filterEventAggregator;
        this.vehiclesGateway = vehiclesGateway;
    }

    async attached() {
        this.filterEventAggregator.subscribeFiltersChanged(() => this.searchUpdated(true));
        this.filterEventAggregator.subscribePagingChanged(() => this.searchUpdated(false));

        await Promise.delay(1000); // faking slow API to show spinner

        const response = await this.vehiclesGateway.getVehicles();

        this.vehicles = new VehiclesModel(response);

        this.loading = false;
        this.firstLoad = false;

        this.buildPaging();
    }

    detached() {
        // we only have one page but this is what we'd need to do with multiple pages
        this.filterEventAggregator.disposeSubscriptions();
    }


    /*
    * ViewModel Methods
    * */
    searchUpdated(newSearch) {
        clearTimeout(this.debounceFilters);
        // debouncing so we don't call API too often, too soon
        this.debounceFilters = setTimeout(async() => {
            this.loading = true;
            const paging = (!newSearch && this.vehicles && this.vehicles.paging) ? this.vehicles.paging : {};

            await Promise.delay(500); // faking a delayed API to mimic real world delay

            this.vehicles = await this.vehiclesGateway.getVehicles(this.filters, paging);

            this.loading = false;
            this.currentPage = 1;

            this.buildPaging();
        }, 500);
    }

    buildPaging() {
    }
}
