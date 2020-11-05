import { inject, bindable, observable, bindingMode } from 'aurelia-framework';
import { SearchEventAggregator } from 'views/search/search-event-aggregator';
import 'bootstrap-select';
import 'bootstrap-slider';
import { VehiclesGateway } from 'gateways/vehicles-gateway';
import { FiltersModel } from 'models/filters-model';
import { PagingModel } from 'models/paging-model';

@inject(SearchEventAggregator, VehiclesGateway)
export class Filters {
    /*
    * Defines
    * */
    @bindable({ defaultBindingMode: bindingMode.twoWay }) filters;
    @bindable vehicles;
    @observable sortBy;

    vehicleAttrs;
    modelsByMaker;
    refMakeSelector;
    refModelSelector;
    refColorSelector;
    refSliderInput;
    refSortBySelector;
    refYearDropdown;
    selectSettings = {
        actionsBox: true,
        liveSearch: true,
        size: 10,
        maxOptions: 5
    };
    sliderSettings = {
        min: 0,
        max: 0,
        step: 1,
        tooltip: 'hide',
        value: [0, 0]
    };
    sortByItems = [
        { id: 'make:asc', name: 'Make Asc <i class="fas fa-sort-amount-down-alt"></i>' },
        { id: 'make:desc', name: 'Make Desc <i class="fas fa-sort-amount-up"></i>' },
        { id: 'model:asc', name: 'Model Asc <i class="fas fa-sort-amount-down-alt"></i>' },
        { id: 'model:desc', name: 'Model Desc <i class="fas fa-sort-amount-up"></i>' },
        { id: 'miles:asc', name: 'Lowest Mileage <i class="fas fa-sort-amount-down-alt"></i>' },
        { id: 'miles:desc', name: 'Highest Mileage <i class="fas fa-sort-amount-up"></i>' },
        { id: 'price:asc', name: 'Lowest Price <i class="fas fa-sort-amount-down-alt"></i>' },
        { id: 'price:desc', name: 'Highest Price <i class="fas fa-sort-amount-up"></i>' },
        { id: 'year:asc', name: 'Oldest Vehicle <i class="fas fa-sort-amount-down-alt"></i>' },
        { id: 'year:desc', name: 'Newest Vehicle <i class="fas fa-sort-amount-up"></i>' }
    ];
    vehiclesGateway;
    filterEventAggregator;
    initialized;


    /*
    * Lifecycle Methods
    * */
    constructor(filterEventAggregator, vehiclesGateway) {
        this.filterEventAggregator = filterEventAggregator;
        this.vehiclesGateway = vehiclesGateway;
    }

    async attached() {
        this.vehicleAttrs = await this.vehiclesGateway.getAttributes(this.filters);

        this.initializeEventHandlers();
    }

    /*
    * Observables
    * */
    vehiclesChanged(newVal) {
        if (!newVal) return;
        console.log('vs', newVal);

        this.setupOptions(newVal);

        if (this.firstLoad) this.firstLoad = false;
    }

    sortByChanged(newVal) {
        const sortItems = newVal.split(':');
        this.filters.sortBy = sortItems[0];
        this.filters.sortByDirection = sortItems[1];

        this.filterEventAggregator.publishFiltersChanged();
    }


    /*
    * ViewModel Methods
    * */
    initializeEventHandlers() {
        $(this.refMakeSelector).selectpicker(this.selectSettings).on('changed.bs.select', () => this.selectedMakeUpdated());

        $(this.refModelSelector).selectpicker(this.selectSettings)
            .add(this.refColorSelector)
            .add(this.refYearDropdown)
            .add(this.refColorSelector)
            .add(this.refSortBySelector)
            .on('changed.bs.select', () => this.filterEventAggregator.publishFiltersChanged());
        $().on('click', (e) => e.stopPropagation());

        $(this.refSliderInput).on('change', (event) => {
            const years = event.value.newValue;

            this.filters.yearStart = years[0];
            this.filters.yearEnd = years[1];

            this.filterEventAggregator.publishFiltersChanged();
        });
    }

    async selectedMakeUpdated() {
        this.filterEventAggregator.publishFiltersChanged();

        this.modelsByMaker = this.vehicleAttrs.models.filter(x => this.filters.makes.includes(x.make));

        await Promise.delay(500);// DOM needs to finish loading

        $(this.refModelSelector).selectpicker('refresh');
    }

    async setupOptions() {
        this.sliderSettings.min = Math.min(...this.vehicleAttrs.years);
        this.sliderSettings.max = Math.max(...this.vehicleAttrs.years);
        this.sliderSettings.value = [this.sliderSettings.min, this.sliderSettings.max];

        if (!this.filters.yearStart) this.filters.yearStart = this.sliderSettings.min;
        if (!this.filters.yearEnd) this.filters.yearEnd = this.sliderSettings.max;

        // refresh selectors
        await Promise.delay(500); // DOM needs to finish loading

        $(this.refMakeSelector)
            .add(this.refColorSelector)
            .add(this.refSortBySelector)
            .selectpicker('refresh');
        $(this.refSliderInput).slider(this.sliderSettings);

        if (!this.initialized) this.initialized = true;
    }

    capitalizeFirstLetter(string) { /* data is inconsistent with capitalization */
        return string.replace(/^./, string[0].toUpperCase());
    }

    keepOpen(event) {
        event.stopPropagation();
    }

    colorBadge(color) {
        color = color.toLowerCase();

        return `background-color: ${color};${color === 'white' ? ' border: 1px solid #ccc;' : ''}`;
    }

    clearFilters() {
        this.filters = new FiltersModel();
        this.filterEventAggregator.publishFiltersChanged();
    }
}
