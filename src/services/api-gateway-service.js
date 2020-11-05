/*
* Service to manage configurations for all API endpoints from a single API service,
* gateways would extend the below
* */
import 'whatwg-fetch';
import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import * as _ from 'lodash';

@inject(HttpClient)
export class ApiGatewayService {
    baseUrl = '/dummydata/';
    _fetchOptions = {
        headers: {
            'X-Requested-With': 'Fetch',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    };

    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    /*
    * Public methods (the below would typically include all types e.g. POST, PUT, etc...
    * */
    async getResponse(url, fetchOptions = {}) {
        url = `${this.baseUrl}/${url}`;

        const options = _.merge(this._fetchOptions, fetchOptions, { method: 'GET' });

        return await this.httpClient.fetch(url, options);
    }
}
