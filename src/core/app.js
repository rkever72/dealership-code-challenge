/*
* aurelia's bootstrapper
* */
import { inject } from 'aurelia-framework';
import { RouteConfig } from './route-config';

@inject(RouteConfig)
export class App {
    refPrivacyPolicyDialog;

    constructor(routeConfig) {
        this.routeConfig = routeConfig;
    }

    /**
     * lifecycle method used to configure an aurelia instance
     */
    configureRouter(config, router) {
        config.title = 'Aurelia';
        config.map(this.routeConfig.routes);

        this.router = router;
    }

    showPrivacyPolicy() {
        $(this.refPrivacyPolicyDialog).modal();
    }
}
