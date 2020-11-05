export class FiltersModel {
    constructor(filters = {}) {
        this.makes = filters.makes || [];
        this.models = filters.models || [];
        this.colors = filters.colors || [];
        this.yearStart = filters.yearStart || null;
        this.yearEnd = filters.yearEnd || null;
        this.sortBy = filters.sortBy || 'make';
        this.sortByDirection = filters.sortByDirection || 'asc';
    }
}
