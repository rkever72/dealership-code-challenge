/*
* Base sub/pub
* */
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BaseEventAggregatorService {
    /**
     * Private defines
     */
    _subscribePrefixName = '_subscribe';


    /**
     * Lifecycle methods
     */
    constructor(eventAggregator) {
        this.eventAggregator = eventAggregator;
    }


    /*
    * Public methods
    */
    // Helper to dispose of all subscriptions using a convention
    disposeSubscriptions() {
        const regex = new RegExp(this._subscribePrefixName);

        for (let key in this) {
            if (regex.test(key) && this[key] && typeof this[key] === 'object' && this[key].hasOwnProperty('dispose')) this[key].dispose();
        }
    }
}
