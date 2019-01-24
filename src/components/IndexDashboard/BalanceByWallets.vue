<template>
  <v-card class="mx-1 mt-2">
    <v-card-title>
      <div><span class="grey--text">Balance </span><br /></div>
    </v-card-title>

    <v-divider light></v-divider>

    <v-layout row>
      <v-flex xs12>
        <ul class="list">
          <li v-for="item in balanceAll">
            <div class="list-row">
              <div class="list-row-ava-letter">
                <span>{{ item.wallet.trim()[0].toUpperCase() }}</span>
              </div>

              <div class="list-column-content">
                <div class="list-row-content">
                  <span>{{ item.wallet }}</span>
                </div>
                <div class="list-row-content content-second">
                  <span>{{ item.currencyCharCode }}</span>
                </div>
              </div>

              <div class="list-column-sum">
                <div class="list-row-sum">
                  <span>{{ item.convertedAmount }}</span>
                </div>

                <div class="list-row-sum content-second">
                  <span>{{ item.balance }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['balanceAll'],
};
</script>

<style scoped>
.list {
  list-style: none;
}

.list-row {
  display: flex;
  flex-direction: row;
  flex-grow: 5;
  justify-content: flex-start;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 50px 0 0 50px;
}

.list-row:hover {
  background-color: rgb(240, 240, 240);
}

.list-row-ava-letter {
  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  text-align: center;
  vertical-align: middle;
  background-color: tomato;
  border-radius: 50%;

  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
}
.list-column-content {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  margin-left: 10px;
}

.list-row-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  flex-grow: 3;

  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
  color: #43425d;
}

.list-column-sum {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.list-row-sum {
  display: flex;
  flex-direction: row;
  /* flex-grow: 1; */
  justify-content: right;
  align-items: center;
  margin-right: 20px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
  color: #43425d;
}

.content-second {
  font-size: 1rem;
  color: darkgrey;
}
</style>
