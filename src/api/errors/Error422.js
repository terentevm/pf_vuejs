"use strict"

class Error422 {

    constructor(response) {
        this.status = response.status;
        this.message = response.data.message;

        this.errors = [];

        for (let key in response.data.errors) {

            this.errors.push({
                field: key,
                message: response.data.errors[key].join(';')
            });
        }

    }

}

export default Error422;