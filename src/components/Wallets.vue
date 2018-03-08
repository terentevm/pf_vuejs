<template>
    <div>
    <md-table v-model="rows" md-card @md-selected="onSelect">
      <md-table-toolbar>
        <h1 class="md-title">Selection Colors</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Currency" md-sort-by="email">{{ item.email }}</md-table-cell>
      </md-table-row>
    </md-table>
    <p>Selected:</p>
    {{ selected }}
    </div>
</template>

<script>

import {HTTP} from './http';
export default {
  
  name: 'Wallets',
    data() {
        return {
            selected: {},
            newItem: '',
            sum: 0,
            rows: [],
            cols: []
        };
    },

    beforeMount: function () {
       
        HTTP.defaults.headers.post['Content-Type'] = 'application/json';
        HTTP.get('http://pf/wallets/index',
        {
            headers: {'Content-Type': 'application/json'}
        }
        )
        .then(response => {
            console.log(response.data);
            this.rows = response.data;
        })
    },
    methods: {
        addRow () {
          console.log(this.rows);
            let row = {
                id: id++,
                item: this.newItem,
                sum: this.sum
            };
            this.rows.push(row); 
        },
        
      getClass: ({ id }) => ({
        'md-primary': id === 2,
        'md-accent': id === 3
      }),
      onSelect (item) {
        this.selected = item
      }
    
    }

}
</script>

