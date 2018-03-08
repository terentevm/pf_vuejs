
<template>

<div>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card ref="form">
         <v-toolbar color="green darken-3" dark>
        
        <v-toolbar-title>Login</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>account_box</v-icon>
        </v-btn>
      </v-toolbar>
    <v-divider class="mt-5"></v-divider>
        <v-card-text>
          <v-text-field
            label="E-mail"
            placeholder="example@mail.com"
            v-model="email"
            prepend-icon="email"
            required
          ></v-text-field>
          <v-text-field
            label="password"
            v-model="password"
            prepend-icon="https"
            :append-icon="e3 ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (e3 = !e3)"
           
            :type="e3 ? 'password' : 'text'"
            required
          ></v-text-field>
          
        </v-card-text>
        <v-divider class="mt-3"></v-divider>
        <v-card-actions>
          <v-btn flat to="/signup">Create new account</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="green darken-3" flat @click="sendData">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</div>


</template>

<script>
import axios from "axios";

export default {
name: 'Login',
data(){
    return {
        name : '',
        email : '',
        password : '',
        success : false,
        errors:[],
        sending: false,
        showSnack: false,
        resultMessage: '',
        e3 : true
    }
},
methods: {
        sendData() {
        this.sending = true; //block the sending button;
        
        let obj = 
        {
            'login': this.email,
            'password': this.password
        };

        let qs = require("qs");

        let params = qs.stringify(obj);
        this.showSnack = false;

        axios({
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/json'
                },
           
            url: 'http://pf/user/login',
            data: params,
            responseType: 'json',
        }).then(response => {
           console.log(this.$router);
           sessionStorage.setItem('jwt', response.data.jwt);
           //this.resultMessage = "OK!";
           //this.showSnack = true; 
           this.sending = false;
          this.$router.push({ path: 'index' })
        })
        .catch(e=>{
            console.log(e);
            this.resultMessage = "Error. Login or password is incorrect!"
            this.showSnack = true;
            this.sending = false;
        });

    }
}  
}
</script>

<style scoped>
    .btn-login {
        background-color: #457D02;
    }
    .btn-signup {
        background-color: #FFA701;
    }

    .formheader {
        text-align: center;
    }

    .question {
        text-align: center
    }
</style>


