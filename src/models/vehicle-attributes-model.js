export class VehicleAttributesModel {
    constructor(attributes = {}) {
        this.makes = attributes.makes || [];
        this.models = attributes.models || [];
        this.colors = attributes.colors || [];
        this.years = attributes.years || [];
    }
}
