import { BaseEventAggregatorService } from 'services/base-event-aggregator-service';

export class SearchEventAggregator extends BaseEventAggregatorService {
    /*
    * Private Defines
    * */
    _eventName = {
        filtersChanged: 'filters-changed',
        pagingChanged: 'paging-changed'
    }

    _subscribeFiltersChanged;
    _subscribePagingChanged;


    /*
    * Public Methods
    * */
    publishFiltersChanged(payload = {}) {
        this.eventAggregator.publish(this._eventName.filtersChanged, payload);
    }

    subscribeFiltersChanged(callback) {
        this._subscribeFiltersChanged = this.eventAggregator.subscribe(this._eventName.filtersChanged, payload => {
            callback(payload);
        });

        return this._subscribeFiltersChanged;
    }

    publishPagingChanged(payload = {}) {
        this.eventAggregator.publish(this._eventName.pagingChanged, payload);
    }

    subscribePagingChanged(callback) {
        this._subscribePagingChanged = this.eventAggregator.subscribe(this._eventName.pagingChanged, payload => {
            callback(payload);
        });

        return this._subscribePagingChanged;
    }
}
