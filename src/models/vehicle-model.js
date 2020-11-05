import { MileageModel } from 'models/mileage-model';

export class VehicleModel {
    constructor(vehicle = {}) {
        this._id = vehicle._id || '';
        this.cityMileage = new MileageModel(vehicle.cityMileage);
        this.color = vehicle.color || '';
        this.description = vehicle.description || '';
        this.highwayMileage = new MileageModel(vehicle.highwayMileage);
        this.make = vehicle.make || '';
        this.miles = vehicle.miles || null;
        this.model = vehicle.model || '';
        this.price = vehicle.price || null;
        this.year = vehicle.year || null;
    }
}
