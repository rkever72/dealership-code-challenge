import { bindable } from 'aurelia-typed-observable-plugin';

export class Vehicle {
    @bindable vehicle;

    dialog() {
        const tmpl = `
            <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title capitalize" id="exampleModalCenterTitle">${this.vehicle.year} ${this.vehicle.make} ${this.vehicle.model}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle"></i> This is not implemented...too much packing to do!
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        $(tmpl).modal();
    }
}
