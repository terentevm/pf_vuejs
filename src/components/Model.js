      import axios from "axios";

      class Model {
        constructor() {
          this.http = axios.create({
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',

            },
            proxy: false,
            data: {}
          });

          //this.host = "http://pf/app";
          this.host = "/app"; //PRODACTION
          //this.host = "http://localhost:9000"; //PRODACTION
                      
        }
        getToken() {
          return sessionStorage.getItem('jwt');
        
        }

        post(url, data) {
          let AUTH_TOKEN = " Bearer " + this.getToken();
          
          return new Promise((resolve, reject) => {
            this.http({
              method: 'POST',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },
              data: data,
              url: url
            
            }).then(response => {
              resolve(response);

            })
              .catch(e => {
                
                reject(e);

              });
          }); //end promise
        }

        get(url){
          let AUTH_TOKEN = " Bearer " + this.getToken();
          return new Promise((resolve, reject) => {
            this.http({
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/json',
                "Authorization": AUTH_TOKEN,
              },

              url: url,
            
            }).then(response => {

            resolve(response.data);

            })
              .catch(e => {
                
                reject(e);

              });
          });

        }

        processResponseData(response) {
          
          var dataObj = undefined;

          console.log(response.data);
          if (typeof(response.data) === "object" && response.data !== null) {
            
            dataObj = response.data;
          }
          else {
            dataObj = {
              success: false,
              data: response.data,
              message: "Unexepcted response type" 
            };  
          }
          
          console.log(dataObj);

          return dataObj;
        }

        signUp(userData) {
          const url= this.host + "/user/signup";
          return this.post(url, userData);  
        }

        login(loginData) {
          
          return new Promise((resolve, reject) => {
            this.http({
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },

              url: this.host + '/user/login',
              data: loginData,
              responseType: 'json',
            }).then(response => {
                let dataObj = this.processResponseData(response);
                
                if (dataObj.success === true) {
                  sessionStorage.setItem('jwt', dataObj.data.jwt);
                  sessionStorage.setItem('settings', dataObj.data.settings);
                  resolve(dataObj.data.settings);
                }
                else {
                  
                  reject(dataObj);
                }    

            })
              .catch(e => {
                console.log(e);
                reject(e);

              });
          });

        }

        getCurrClassificator() {
          
          let AUTH_TOKEN = " Bearer " + this.getToken();
          return new Promise((resolve, reject) => {
            this.http({
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": AUTH_TOKEN,
                'Accept': 'text/json'
              },
              url: this.host + '/settings/currencyclassificator',
              responseType: 'json',
            }).then(response => {
              resolve(response.data);
            })
              .catch(e => {
                console.log(e);
                reject(e);

              });
          });
        }

        //CURRENCIES

        getCurrencies(offset) {
          let url = this.host + "/currency/index?offset=" + offset;
          let AUTH_TOKEN = " Bearer " + this.getToken();
          return new Promise((resolve, reject) => {
            this.http({
              method: 'GET',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },

              url: url,
              
              responseType: 'json',
            }).then(response => {
              resolve(response.data);

            })
              .catch(e => {
                console.log(e);
                reject(e);

              });
          });
        }
        saveCurrency(item, update){
          let AUTH_TOKEN = " Bearer " + this.getToken();
          let url = '';
          if (update === false) {
            url = this.host + "/currency/create";
          } else {
            url = this.host + "/currency/update";
          }
          return new Promise((resolve, reject) => {
            this.http({
              method: 'POST',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },
              data: item,
              url: url
            
            }).then(response => {
              resolve(response);

            })
              .catch(e => {
                
                reject(e);

              });
          }); //end promise
        }

        //WALLETS

        getWallets(offset) {
          let url = this.host + "/wallets/index?offset=" + offset;
          let AUTH_TOKEN = " Bearer " + this.getToken();
          return new Promise((resolve, reject) => {
            this.http({
              method: 'GET',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },

              url: url,
              
              responseType: 'json',
            }).then(response => {
              resolve(response.data);

            })
              .catch(e => {
                console.log(e);
                reject(e);

              });
          });
        } //end getWallets

        saveWallet(item, update) {
        
          let AUTH_TOKEN = " Bearer " + this.getToken();
          let url = '';
          if (update === false) {
            url = this.host + "/wallets/create";
          } else {
            url = this.host + "/wallets/update";
          }
          return new Promise((resolve, reject) => {
            this.http({
              method: 'POST',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },
              data: item,
              url: url
            
            }).then(response => {
              resolve(response.data);

            })
              .catch(e => {
                
                reject(e);

              });
          }); //end promise
        }

        //settings
        saveSettings(item, update) {
          let AUTH_TOKEN = " Bearer " + this.getToken();
          let url = '';
          if (update === false) {
            url = this.host + "/settings/create";
          } else {
            url = this.host + "/settings/update";
          }
          return new Promise((resolve, reject) => {
            this.http({
              method: 'POST',
              headers: {
                "Authorization": AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'text/json'
              },
              data: item,
              url: url
            
            }).then(response => {
              resolve(response);

            })
              .catch(e => {
                
                reject(e);

              });
          }); //end promise  
        }

        getExpenditureItems() {
          const url= this.host + "/expenditureitems/index?list=1";
          return this.get(url);

        }

        getExpenditureItemsTree() {
          const url= this.host + "/expenditureitems/index";
          return this.get(url);

        }

        saveExpenditureItems(data , isUpdate) {

          let url = this.host + "/expenditureitems/create";
          if (isUpdate === true) {
            url= this.host + "/expenditureitems/update";  
          } 
          
          return this.post(url, data);
        }

        getExpends(offset) {
          const url= this.host + "/expenditure/index?limit=20&offset=" + offset;
          return this.get(url);

        }

        getExpend(id) {
          const url= this.host + "/expenditure/show?id=" + id;
          return this.get(url);

        }

        saveExpend(data) {
          
          let url ='';
          if (data.id == null || data.id == undefined) {
            url = this.host + "/expenditure/create";
          }
          else {
            url = this.host + "/expenditure/update";
          }

          return this.post(url, data);
        }


        transfersIndex(offset) {
          const url = this.host + "/transfer/index?limit=20&offset=" + offset;
          return this.get(url);
        }

        getTransfer(id) {
          const url= this.host + "/transfer/show?id=" + id;
          return this.get(url);
        }

        saveTransfer(data, isUpdate) {
          let url =this.host + "/transfer/create";

          if (isUpdate === true) {
            let url =this.host + "/transfer/update";
          }

          return this.post(url, data);
        }
        
      }//end class
      export default Model;