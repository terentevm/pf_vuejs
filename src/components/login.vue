
<template>

<div>
  <v-layout >
    <v-flex xs12 sm12 md12 lg6 offset-lg-3>
        <v-form>
      <v-card ref="form">
        <!-- <v-toolbar color="green darken-3" dark>
        
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>account_box</v-icon>
            </v-btn>
        </v-toolbar> -->
    <v-divider class="mt-5"></v-divider>
        <v-card-text>
          <v-text-field
            label="E-mail"
            placeholder="example@mail.com"
            v-model="email"
            prepend-icon="email"
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
           :error-messages="errors.collect('password')"
            v-validate="'required|min:3'"
            data-vv-name="password"
     
            :type="e3 ? 'password' : 'text'"
            required
          ></v-text-field>
          <span v-if="success === false" class="body-2 error_text">Login or password are incorrect!</span>
        </v-card-text>
        
         <v-card-actions>
           <v-container fluid grid-list-md>
             <v-layout row wrap>
               <v-flex d-flex xs12 sm6 md6>
                 <v-btn outline  color="success" block :loading="sending" :disabled="sending" @click="sendData">Login</v-btn>
               </v-flex>
               <v-flex d-flex xs12 sm6 md6>
                 <v-btn outline  color="indigo " block to="/signup">Create new account</v-btn>
               </v-flex>
             </v-layout>
           </v-container>
    
        
        </v-card-actions>
          

          
      
      </v-card>
       </v-form>
    </v-flex>
  </v-layout>
</div>


</template>

<script>

import ModelClass from "./Model";


const Model = new ModelClass();

export default {
name: 'Login',
$_veeValidate: {
      validator: 'new'
    },
data(){
    return {
        name : '',
        email : '',
        password : '',
        success : true,
       
        sending: false,
        showSnack: false,
        resultMessage: '',
        e3 : true,
        
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
beforeMount: function(){
    this.$store.state.title = "Login";
    sessionStorage.removeItem("jwt");
    this.$store.state.auth = false;
},
mounted () {
      this.$validator.localize('en', this.dictionary)
    },
methods: {
        sendData() {
        this.$validator.validateAll().then((result)=>{
            if (!result) {
                return;
            }
            
        
            this.sending = true; //block the sending button;
            
            let obj = 
            {
                'login': this.email,
                'password': this.password
            };

            let qs = require("qs");

            let params = qs.stringify(obj);
            this.showSnack = false;

            Model.login(obj).then((settings) => {
                this.sending = false;
                this.success = true;
                this.$store.state.auth = true;

                if (settings.newUser === true) {
                  this.$router.push({ path: 'newsettings' }) ; 
                }
                else {
                  this.$router.push({ path: 'index' });
                }
                
            })
            .catch(e=>{
                
                this.resultMessage = "Error. Login or password is incorrect!"
                this.showSnack = true;
                this.success = false;
                this.sending = false;
            });
        });
    }
}  
}
</script>

<style scoped>
    .error_text {
        color: red;
    }

    .formheader {
        text-align: center;
    }

    .question {
        text-align: center
    }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>


