import { inject } from 'aurelia-framework';
import { SearchEventAggregator } from './search-event-aggregator';
import { VehiclesGateway } from 'gateways/vehicles-gateway';
import { FiltersModel } from 'models/filters-model';
import { VehiclesModel } from 'models/vehicles-model';
import { PagingModel } from 'models/paging-model';

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
    showingStartNum;
    showingEndNum;


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

        this.setVehiclesAndFeatures();
    }

    detached() {
        // we only have one page but this is what we'd need to do with multiple pages
        this.filterEventAggregator.disposeSubscriptions();
    }


    /*
    * ViewModel Methods
    * */
    async setVehiclesAndFeatures(filters = new FiltersModel(), paging = new PagingModel()) {
        this.loading = true;

        await Promise.delay(1000); // faking a delayed API to mimic real world delay

        this.vehicles = await this.vehiclesGateway.getVehicles(filters, paging);

        this.loading = false;
        this.currentPage = 1;

        this.buildShowingXtoYItems();
    }

    searchUpdated(newSearch) {
        clearTimeout(this.debounceFilters);
        // debouncing so we don't call API too often, too soon
        this.debounceFilters = setTimeout(async() => {
            const paging = (!newSearch && this.vehicles && this.vehicles.paging) ? this.vehicles.paging : {};

            await this.setVehiclesAndFeatures(this.filters, paging);
        }, newSearch ? 500 : 0);
    }

    buildShowingXtoYItems() {
        this.showingStartNum = (this.vehicles.paging.pageSize * (this.vehicles.paging.currentPage - 1)) + 1;
        this.showingEndNum = this.showingStartNum + (this.vehicles.paging.pageSize - 1);

        if (this.showingEndNum > this.vehicles.paging.totalItems) this.showingEndNum = this.vehicles.paging.totalItems;
    }
}
