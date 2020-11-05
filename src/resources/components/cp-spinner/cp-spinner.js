import { bindable } from 'aurelia-typed-observable-plugin';

export class CpSpinner {
    @bindable.booleanAttr modal = false;

    constructor() {}
}
