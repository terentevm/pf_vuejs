import axios from 'axios';
import config_prod from './config_prod';
import config_dev from './config_dev';

import Error422 from './errors/Error422';

let connection = null;

const URL_SIGNUP = '/api/signup';
const URL_LOGIN = '/api/login';
const URL_SETTINGS = '/api/settings';
const URL_CURRENCIES = '/api/currencies';
const URL_WALLETS = '/api/wallets';
const URL_CONTACTS = '/api/contacts';
const URL_ITEMS_EXPENDITURE = '/api/itemsexpense';
const URL_ITEMS_INCOME = '/api/itemsincome';
const URL_DOC_EXPENSES = '/api/expenses';
const URL_DOC_INCOMES = '/api/incomes';
const URL_DOC_TRANSFERS = '/api/transfers';

const routesMap = new Map();

routesMap.set('currencies', URL_CURRENCIES);
routesMap.set('wallets', URL_WALLETS);
routesMap.set('itemsexpense', URL_ITEMS_EXPENDITURE);
routesMap.set('itemsincome', URL_ITEMS_INCOME);
routesMap.set('expenses', URL_DOC_EXPENSES);
routesMap.set('incomes', URL_DOC_INCOMES);
routesMap.set('transfers', URL_DOC_TRANSFERS);
routesMap.set('settings', URL_SETTINGS);
routesMap.set('contacts', URL_CONTACTS);

const isProduction = process.env.NODE_ENV === 'production';

function createUrlNotFoundError(model) {
    return new Error(`URL for model ${model} is undefined`);
}

function errorHandler(error) {

    console.log('error handling start');
    console.dir(error);

    const err = {
        status: undefined,
        data: {
            error: ''
        },
    };

    if (error.response) {

        if (error.response.status === 422) {
            return new Error422(error.response);
        }

        err.status = error.response.status;

        if (error.response.data
            && error.response.data instanceof Object
            && error.response.data.hasOwnProperty('error')) {

            err.data.error = error.response.data.error;
        }
        else if (error.response.data && typeof error.response.data === 'string') {
            err.data.error = error.response.data;
        }
        else {
            err.data.error = 'Some error occurred';
        }

    } else if (error.request) {

        err.data.error = 'Connection error';

    } else {

        err.data.error = error.message;

    }

    return err;
}

class Connection {
    constructor() {
        this._http = axios.create({
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            proxy: false,
            data: {},
        });

        this.host = isProduction ? config_prod.host : config_dev.host;

        this._http.interceptors.request.use(config => {

            if (sessionStorage.getItem('jwt')) {
                config.headers.Authorization = `Bearer ${sessionStorage.getItem('jwt')}`;
            }

            return config;
        });

    }

    async login(login, password) {
        try {
            const res = await this._http.post(URL_LOGIN, {login: login, password: password});
            return res.data;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    async signup(user) {
        try {
            const res = await this._http.post(URL_SIGNUP, user);
            return res.data;
        } catch (e) {
            console.dir(e);
            throw errorHandler(e);
        }
    }

    async index(model, queryParams) {

        let url = routesMap.get(model);

        try {
            let res = await this._http.get(url, {
                params: queryParams,
            });

            return res.data;

        } catch (e) {
            throw errorHandler(e);
        }


    }

    async show(model, id, queryParams) {

        let url = routesMap.get(model);

        if (url === undefined) {
            throw createUrlNotFoundError(model);
        }

        try {

            let res = await this._http.get(`${url}/${id}`, {
                params: queryParams,
            });

            return res.data;

        } catch (e) {
            throw errorHandler(e);
        }
    }

    async store(model, data) {

        let url = routesMap.get(model);

        try {
            let res = await this._http.post(url, data);
            return res.data;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    async update(model, id, data) {

        let url = `${routesMap.get(model)}/${id}`;

        try {
            let res = await this._http.put(url, data);
            return res.data;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    async delete(model, id) {

        let url = `${routesMap.get(model)}/${id}`;

        try {
            await this._http.delete(url);
            return true;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    async get(url, queryParams) {

        try {
            let res = await this._http.get(url, {
                params: queryParams,
            });
            return res.data;
        } catch (e) {
            throw errorHandler(e);
        }
    }

    async post(url, data) {

        try {
            let res = await this._http.post(url, data);
            return res.data;
        } catch (e) {
            throw errorHandler(e);
        }
    }

}

export default function getConn() {
    return connection ? connection : new Connection();
}
