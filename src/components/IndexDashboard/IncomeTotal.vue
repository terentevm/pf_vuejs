
<template>

    <v-card class="mx-1 mt-2">
    <v-card-title>
        <div>
            <span class="grey--text">Incomes</span><br>
        </div>
        </v-card-title>
        
        <v-divider light></v-divider>
        
        <v-layout>
                  
            <v-flex xs7>
                <v-card-title primary-title>
                    <div>
                        <div class="headline">{{ totalIncomes }} CZK</div>
                    </div>
                </v-card-title>
            </v-flex>

                <v-flex xs5 d-flex justify-space-around >
                    <img src="../../assets/graph_income.svg" height="64px" width="64px">
                </v-flex>

        </v-layout>
    </v-card>    

</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    props: ['totalIncomes']    
}
</script>

