/*
*   This is the aurelia bootstrapper file; the main entry file for the
*   framework which looks for the configure method to fire it all up
* */
import 'jquery';
import 'bluebird';
import 'bootstrap';
import 'popper.js';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';

/*
* aurelia framework main entry point.
* */
export async function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('resources/index'))
        .developmentLogging(environment.debug ? 'debug' : 'warn');

    await aurelia.start();

    return await aurelia.setRoot(PLATFORM.moduleName('core/app'));
}
