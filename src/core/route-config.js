/*
* All URL routes reside in here.  You can also setup parameters (required and/or optional) and other custom properties
* */
import { PLATFORM } from 'aurelia-pal';

export class RouteConfig {
    routes = [
        {
            route: ['', 'search'],
            name: 'search',
            moduleId: PLATFORM.moduleName('views/search/index'),
            nav: true,
            title: 'Search Our Inventory'
        }
        /* Example using params and custom settings
        ,{
            route: 'myarea/route/:requiredParam/:optionalParam?',
            name: 'myarea',
            moduleId: PLATFORM.moduleName('views/my-area/view-model'),
            nav: true,
            title: 'My Area',
            settings: { myObject: stuff }
        }
        */
    ];
}
