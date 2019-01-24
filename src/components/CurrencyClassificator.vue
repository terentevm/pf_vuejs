<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-flex xs12 sm12 md12 lg12>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="classificator"
        :search="search"
        select-all
        class="elevation-1"
        item-key="short_name"
        hide-actions
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th></th>

            <th v-for="header in props.headers" :key="header.text" class="header.class">
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td>
              <v-checkbox primary hide-details :input-value="props.selected"></v-checkbox>
            </td>

            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.short_name }}</td>
            <td class="d-none">{{ props.item.code }}</td>
            <td class="d-none">{{ props.item.mult }}</td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="progress">
            <v-progress-circular
              indeterminate
              :size="70"
              :width="2"
              color="green"
            ></v-progress-circular>
          </div>
        </template>
      </v-data-table>
      <v-fab-transition v-if="showSaveBtn">
        <v-btn fab fixed bottom right dark @click="save()" color="success" :loading="process">
          <v-icon>done_all</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-flex>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ApiClass from './Api';
const Api = new ApiClass();

export default {
  data: () => ({
    headers: [{ text: 'Name', value: 'name' }, { text: 'Char code', value: 'short_name' }],
    selected: [],
    search: '',
    process: false,
    loader: null,
  }),

  computed: {
    showSaveBtn() {
      return this.selected.length > 0;
    },
    ...mapGetters({
      classificator: 'currencyClassificator',
    }),
  },

  beforeMount: function() {
    this.$store.state.title = 'Classificator';
    this.$store.dispatch('getCurrencyClassificator');
    this.$store.state.componentMenu = [];
  },

  methods: {
    async save() {
      if (this.process === true) {
        return;
      }

      this.loader = 'loading';
      this.process = true;

      let param = {
        model: 'currency',
        data: null,
      };

      for (let item of this.selected) {
        param.data = item;
        let ok = await Api.save(param);
        console.log(ok);
      }

      this.process = false;
    },
  },

  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
  },
};
</script>

<style>
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
