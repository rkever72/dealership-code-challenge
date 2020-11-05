export class MileageModel {
    constructor(mileage = {}) {
        this.high = mileage.high || null;
        this.low = mileage.low || null;
    }
}
