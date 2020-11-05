import {PLATFORM} from 'aurelia-pal';

export function configure(config) {
    config.globalResources([
        PLATFORM.moduleName('./components/cp-spinner/cp-spinner'),
        PLATFORM.moduleName('./components/cp-truncate/cp-truncate'),
        PLATFORM.moduleName('./value-converters/currency-value-converter'),
        PLATFORM.moduleName('./value-converters/number-value-converter')
    ]);
}
