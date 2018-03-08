<template>
<div>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card ref="form">
         <v-toolbar color="green darken-3" dark>
        
        <v-toolbar-title>Signup</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>account_box</v-icon>
        </v-btn>
      </v-toolbar>
    <v-divider class="mt-5"></v-divider>
        <v-card-text>
          <v-text-field
            label="Name"
            placeholder="example@mail.com"
            v-model="name"
            prepend-icon="face"
            required
          ></v-text-field>
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
          <v-spacer></v-spacer>

          <v-btn color="green darken-3" flat @click="sendData">Signup</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import axios from "axios";

export default {
name: 'Signup',
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
            'name': this.name,
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
           
            url: 'http://pf/user/signup',
            data: params,
            responseType: 'json',
        }).then(response => {
           this.resultMessage = "User has been created successfully!";
           this.showSnack = true; 
           this.sending = false;
        })
        .catch(e=>{
            this.resultMessage = "Error. Inputed data are invalid!"
            this.showSnack = true;
            this.sending = false;
        });

    }
}  
}
</script>

<style scoped>
    .btn-signup {
        background-color: #FFA701;
    }

    .formheader {
        text-align: center;
    }
</style>


