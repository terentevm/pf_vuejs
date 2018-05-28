import axios from "axios";

class Api {

    constructor() {
        this.logToConsole = true;
        this.http = axios.create({
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',

            },
            proxy: false,
            data: {}
          });

          this.host = "http://pf/app";
          //this.host = "/app"; //PRODACTION
          //this.host = "http://localhost:9000"; //PRODACTION
    }

  
 
    /**
     * 
     * @param {Object} params 
     * {
     *  model: 'wallets',
     *  conditions: {id: 123, name: test}
     * }
     * @return {Array}
     */
    
    async index(params) {
        let model = params.model;
        let fullUrl = `${this.host}/${model}/index`
        const AUTH_TOKEN = this.getToken();
        let conditions = this.getConditions(params);
        
        try {
            const res = await this.http.request({
                method: 'GET',
                headers: {
                    "Authorization": AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'text/json'
                },
                params: conditions,
                url: fullUrl
            });
            
            if (typeof(res.data) == "object") {
                
                if (this.isCorrectResponse(res.data)) {
                    
                    if (res.data.success === true) {
                        
                       
                        return res.data.data;  //return result from server to model for rendering
                        
                    }
                    else {
                        
                        this.toConsole("error") 
                        this.toConsole(res.data.msg) 
                       
                        return [];   
                    }
                }
                else {

                    console.log(res.data);
                    return [];  
                }
            } 
            
            else {
                if (res.data === null) {
                    this.toConsole("Response data is null");   
                }
                else {
                    this.toConsole(res.data.toString()) ; 
                }    

                return [];
            }
        }
        catch (err) {
            this.toConsole("Error") ;
            return [];
        }         
        
    } //end index

    async show(params) {
        let model = params.model;
        let fullUrl = `${this.host}/${model}/show`
        const AUTH_TOKEN = this.getToken();
        let conditions = this.getConditions(params);
        
        if (("id" in conditions) === false) {
            return false;
        }

        try {
            const res = await this.http.request({
                method: 'GET',
                headers: {
                    "Authorization": AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'text/json'
                },
                params: conditions,
                url: fullUrl
            });
            
            if (typeof(res.data) == "object") {
                
                if (this.isCorrectResponse(res.data)) {
                    
                    if (res.data.success === true) {
                        
                       
                        return res.data.data;  //return result from server to model for rendering
                        
                    }
                    else {
                        
                        this.toConsole("error") 
                        this.toConsole(res.data.msg) 
                       
                        return false;   
                    }
                }
                else {

                    console.log(res.data);
                    return false;  
                }
            } 
            
            else {
                if (res.data === null) {
                    this.toConsole("Response data is null");   
                }
                else {
                    this.toConsole(res.data.toString()) ; 
                }    

                return false;
            }
        }
        catch (err) {
            this.toConsole("Error") ;
            return false;
        }  
    }

    async save(params) {
        const model = params.model;
        let fullUrl = `${this.host}/${model}/create`;
        if (params.isUpdate === true) {
            fullUrl = `${this.host}/${model}/update` ;  
        }
        const AUTH_TOKEN = this.getToken();
        const data = params.data;
        
        try {
            const res = await this.http.request({
                method: 'POST',
                headers: {
                    "Authorization": AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'text/json'
                },
                data: data,
                url: fullUrl
            });

            if (typeof(res.data) == "object") {
                
                if (this.isCorrectResponse(res.data)) {
                    
                    
                    if (res.data.success === true) {
                        
                        return res.data.success;  //return result from server to model for rendering
                        
                    }
                    else {
                        
                        this.toConsole(res.data.msg) 
                       
                        return false;   
                    }
                }
                else {

                    this.toConsole("unexpected response data"); 
                    return false;  
                }
            } 
            
            else {
                if (res.data === null) {
                    this.toConsole("Response data is null");   
                }
                else {
                    this.toConsole(res.data.toString()) ; 
                }    

                return false;
            }

        }
        catch (err) {
            
            if (this.isCorrectResponse(err.response.data)) {
                this.toConsole(err.response.data.msg)     
            }

            return false;
        }
        
    }

    getToken() {
        let jwt = sessionStorage.getItem('jwt');

        if (jwt == undefined || jwt == null) {
            return "";
        }
        
        return " Bearer " + jwt;
    }

    getConditions(params) {
        if ("conditions" in params) {
            return params.conditions;
        }
        else {
            return {};
        }
    }

    isCorrectResponse(data) {
        if ("success" in data) {
            return true;
        }

        return false;
    }

    toConsole(msg) {
        if (this.logToConsole === true) {
            console.log(msg);
        }
    }

} // end class

export default Api;