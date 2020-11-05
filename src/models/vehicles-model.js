import { PagingModel } from 'models/paging-model';


export class VehiclesModel {
    constructor(vehicles) {
        this.list = vehicles.list || null;
        this.paging = vehicles.paging || new PagingModel();
    }
}
