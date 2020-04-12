const File = require('./file');
const file = new File();

const RouteCalculator = class RouteCalculator {

    constructor(from, to) {
        this._routes = null;
        this.from = from.toString().toUpperCase();
        this.to = to.toString().toUpperCase();
    }

    async _setRoutes() {
        this._routes = await file.read();
    }

    async calculate() {
        await this._setRoutes();
        const fromRoutes = this._getRoutesFrom('from');
        const toRoutes = this._getRoutesFrom('to');

        // checa se existe alguma rota direta entre from e to
        const directlyRoute = this._getDirectlyRoute(fromRoutes);

        if (!directlyRoute) {
            throw new Error('Digite um destino valido');
        }

        // verifica se existe paradas
        const stopsRoutes = this._getStopsRoutes(fromRoutes, toRoutes);

        if (stopsRoutes) {
            if (directlyRoute.price > stopsRoutes.price) {
                return this._createRoutePrint(stopsRoutes);
            }
            return this._createRoutePrint(directlyRoute);
        }

        return this._createRoutePrint(directlyRoute);
    }

    _getRoutesFrom(type) {
        let routes = [];
        for (const route of this._routes) {
            if (this[type] === route[type]) {
                routes.push(route);
            }
        }
        return routes;
    }

    _getDirectlyRoute(routes) {
        let routeDirectly = [];
        for (const route of routes) {
            if (route.from === this.from && route.to === this.to) {
                routeDirectly.push(route);
            }
        }

        // Pega a rota com menor valor
        return routeDirectly.reduce((previousValue, currentValue) => {
            return previousValue.price < currentValue.price ? previousValue : currentValue;
        })
    }

    _getStopsRoutes(...routes) {
        let stops = null;
        const [fromRoutes, toRoutes] = routes;

        for (const fromRoute of fromRoutes) {
            for (const toRoute of toRoutes) {
                if (fromRoute.to === toRoute.from) {
                    stops = this._mergeStops(fromRoute, toRoute);
                }
            }
        }

        return stops;
    }

    _mergeStops(fromRoute, toRoute) {
        return {
            from: fromRoute.from,
            stop: fromRoute.to,
            to: toRoute.to,
            price: Math.ceil(parseInt(fromRoute.price) + parseInt(toRoute.price))
        }
    }

    _createRoutePrint(route) {
        let ret = {
            route: '',
            price: ''
        };

        ret.price = route.price;
        delete route.price;
        ret.route = Object.values(route).join(',');

        return ret;
    }

};

// const routeCalculator = new RouteCalculator('GRU', 'SCL');
// routeCalculator.calculate().then(value => {
//     console.log(value);
// });

module.exports = RouteCalculator;
