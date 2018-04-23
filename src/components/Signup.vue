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
            placeholder="Ivan Ivanov"
            v-model="name"
            prepend-icon="face"
            required
            :error-messages="errors.collect('name')"
            v-validate="'required|min:2'"
            data-vv-name="name"
          ></v-text-field>
          <v-text-field
            label="E-mail"
            placeholder="example@mail.com"
            v-model="email"
            prepend-icon="email"
            required
            :error-messages="errors.collect('email')"
             v-validate="'required|email'"
            data-vv-name="email"
          ></v-text-field>
          <v-text-field
            label="password"
            v-model="password"
            prepend-icon="https"
            :append-icon="e3 ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (e3 = !e3)"
           
            :type="e3 ? 'password' : 'text'"
            required
            :error-messages="errors.collect('password')"
            v-validate="'required|min:3'"
            data-vv-name="password"
          ></v-text-field>
          
        </v-card-text>
        
        <v-card-actions>
          

          <v-btn :disabled="sending" outline  color="success" block flat @click="sendData">Signup</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-snackbar
      :timeout="msgSettings.timeout"
      :color="msgSettings.color"
      :multi-line="msgSettings.mode === 'multi-line'"
      :vertical="msgSettings.mode === 'vertical'"
      v-model="msgSettings.show"
    >
      {{ msgSettings.msg }}
      <v-btn dark flat @click.native="msgSettings.show = false">Close</v-btn>
    </v-snackbar>
</div>
</template>

<script>
import axios from "axios";

export default {
name: 'Signup',
$_veeValidate: {
      validator: 'new'
    },
data(){
    return {
        name : '',
        email : '',
        password : '',
        success : false,
        
        sending: false,
        showSnack: false,
        resultMessage: '',
        e3 : true,
        msgSettings: {
          show: false,
          color: "light-green darken-3",
          mode: 'vertical',
          timeout: 6000,
          msg: ''
        },
        dictionary: {
        attributes: {
          email: 'E-mail Address'
          // custom attributes
        },
        custom: {
          name: {
            required: () => 'Name can not be empty',
            max: 'The name field may not be greater than 10 characters'
            // custom messages
          }
        }
      }
    
    }
},
mounted () {
      this.$validator.localize('en', this.dictionary)
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
           
            url: 'http://pf/app/user/signup',
            data: params,
            responseType: 'json',
        }).then(response => {
           this.$router.push({ path: 'login' });
        })
        .catch(e=>{
           this.sending = false;
           this.msgSettings.color =  "orange darken-4";
            this.msgSettings.msg = `User with e-mail ${this.email} is exists!` ;
            this.msgSettings.show = true; 
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


