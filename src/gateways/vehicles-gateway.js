import { ApiGatewayService } from 'services/api-gateway-service';
import { VehicleModel } from 'models/vehicle-model';
import { VehiclesModel } from 'models/vehicles-model';
import { FiltersModel } from 'models/filters-model';
import { PagingModel } from 'models/paging-model';
import { VehicleAttributesModel } from 'models/vehicle-attributes-model';

export class VehiclesGateway extends ApiGatewayService {
    async getVehicles(filters = new FiltersModel(), paging = new PagingModel()) {
        const url = 'vehicles.json';
        const response = await this.getResponse(url);

        let list = await response.json();

        // fake pagination which would typically be managed by API controller
        list = list.map(x=>new VehicleModel(x));
        list = this._filterVehicles(filters, list);

        paging = this._paginate(list.length, paging.currentPage, list);

        list = list.slice((paging.currentPage - 1) * paging.pageSize, paging.currentPage * paging.pageSize);

        return new VehiclesModel({ list, paging });
    }

    async getAttributes(filters = new FiltersModel()) {
        // fake gateway to get all available attributes for dropdowns
        const url = 'vehicles.json';
        const response = await this.getResponse(url);
        const vehicles = await response.json();

        return new VehicleAttributesModel({
            makes: this._buildAttrsFromAvailableVehicles(vehicles, 'make'),
            models: this._buildAttrsFromAvailableVehicles(vehicles, 'model'),
            colors: this._buildAttrsFromAvailableVehicles(vehicles, 'color'),
            years: this._buildAttrsFromAvailableVehicles(vehicles, 'year')
        });
    }

    /*
    * The section below exists to mimic filters and pagination which would normally happen in an API
    * */
    _buildAttrsFromAvailableVehicles(vehicles, key) {
        let items = [];

        if (key !== 'model') {
            items = Array.from(new Set(vehicles.map(item => item[key]))).sort();
        } else {
            const makes = Array.from(new Set(vehicles.map(item => item.make))).sort();

            for (let i in makes) {
                const make = makes[i];
                const group = vehicles.filter(x=>x.make === make);

                items.push({ make, models: Array.from(new Set(group.map(item => item.model))).sort()});
            }
        }

        return items;
    }

    _filterVehicles(filters, vehicles) {
        let vehiclesToShow = [];
        let hasFilters = false;

        if (filters.makes.length > 0) {
            hasFilters = true;
            let makesWithNoModels = filters.makes;

            if (filters.models.length > 0) {
                for (let i1 in filters.models) {
                    const items = filters.models[i1].split(':');
                    const make = items[0];
                    const model = items[1];
                    vehiclesToShow.push(...vehicles.filter(x => x.make === make && x.model === model));

                    makesWithNoModels = makesWithNoModels.filter(x => x !== make);
                }
            }

            vehiclesToShow.push(...vehicles.filter(x => makesWithNoModels.includes(x.make)));
        }

        if (!hasFilters) vehiclesToShow = vehicles;

        if (filters.colors.length > 0) vehiclesToShow = vehiclesToShow.filter(x => filters.colors.includes(x.color));
        if (filters.yearStart && filters.yearEnd) vehiclesToShow = vehiclesToShow.filter(x => (x.year >= filters.yearStart && x.year <= filters.yearEnd));

        if (filters.sortBy) {
            const comparer = (/year|price|miles/gi.test(filters.sortBy)) ?
                (a, b) => (a[filters.sortBy] > b[filters.sortBy]) ? 1 : -1 :
                (a, b) => a[filters.sortBy].localeCompare(b[filters.sortBy], undefined, { sensitivity: 'base' });

            vehiclesToShow.sort(comparer);

            if (filters.sortByDirection === 'desc') vehiclesToShow.reverse();
        }

        return vehiclesToShow;
    }

    _paginate(totalItems, currentPage) {
        let startPage;
        let endPage;
        const pageSize = 50;
        let totalPages = Math.ceil(totalItems / pageSize);
        const maxPages = 10;

        currentPage = (currentPage < 1) ? 1 : (currentPage > totalPages) ? totalPages : currentPage;

        if (totalPages <= maxPages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            let maxPagesBefore = Math.floor(maxPages / 2);
            let maxPagesAfter = Math.ceil(maxPages / 2) - 1;

            if (currentPage <= maxPagesBefore) {
                startPage = 1;
                endPage = maxPages;
            } else if (currentPage + maxPagesAfter >= totalPages) {
                startPage = totalPages - maxPages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBefore;
                endPage = currentPage + maxPagesAfter;
            }
        }

        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        return new PagingModel({
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            pages
        });
    }
}
