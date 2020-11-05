import { inject, bindable, bindingMode } from 'aurelia-framework';
import { SearchEventAggregator } from 'views/search/search-event-aggregator';

@inject(SearchEventAggregator)
export class Pagination {
    /*
    * Defines
    * */
    @bindable({ defaultBindingMode: bindingMode.twoWay }) paging;


    /*
    * Lifecycle Methods
    * */
    constructor(searchEventAggregator) {
        this.searchEventAggregator = searchEventAggregator;
    }


    /*
    * ViewModel Methods
    * */
    navigatePaging(step) {
        if (step === this.paging.currentPage) return;

        switch (step) {
            case 'next':
                this.paging.currentPage++;
                break;
            case 'prev':
                this.paging.currentPage--;
                break;
            default:
                this.paging.currentPage = step;
                break;
        }

        this.searchEventAggregator.publishPagingChanged();
    }
}
