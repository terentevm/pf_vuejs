<template>
  <v-container fluid grid-list-sm>
    <div class="panel-top">
      <v-layout row wrap> 
          <v-flex d-flex xs12 sm6 md4 >
            <v-hover>
              <v-card slot-scope="{ hover }" class="mx-1 mt-2">
                <v-card-title>
                  <div>
                    <span class="grey--text">Balance</span><br>
                  </div>
                </v-card-title>
                <v-divider light></v-divider>
                <v-layout>
                  
                  <v-flex xs7>
                    <v-card-title primary-title>
                      <div>
                        <div class="headline">999999 CZK</div>
                      </div>
                    </v-card-title>
                  </v-flex>

                  <v-flex xs5 d-flex justify-space-around >
                    <img src="../assets/balance.svg" height="64px" width="64px">
                  </v-flex>

                </v-layout>
              </v-card>
            </v-hover>
            
          </v-flex>

          <v-flex d-flex xs12 sm6 md4 >
            <v-card class="mx-1 mt-2">
              <v-card-title>
                  <div>
                    <span class="grey--text">Expences</span><br>
                  </div>
                </v-card-title>
                <v-divider light></v-divider>
                <v-layout>
                  
                  <v-flex xs7>
                    <v-card-title primary-title>
                      <div>
                        <div class="headline">999999 CZK</div>
                      </div>
                    </v-card-title>
                  </v-flex>

                  <v-flex xs5 d-flex justify-space-around >
                    <img src="../assets/graph_expenses.svg" height="64px" width="64px">
                  </v-flex>

                </v-layout>
            </v-card>
          </v-flex>

          <v-flex d-flex xs12 sm6 md4>
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
                        <div class="headline">999999 CZK</div>
                      </div>
                    </v-card-title>
                  </v-flex>

                  <v-flex xs5 d-flex justify-space-around >
                    <img src="../assets/graph_income.svg" height="64px" width="64px">
                  </v-flex>

                </v-layout>
            </v-card>
          </v-flex>

      </v-layout>
    </div>
    
  </v-container>
</template>

<script>


</script>

<style scoped>
  .form-wrapper {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .panel-top {
    padding: 10px;
  }
  
</style>



