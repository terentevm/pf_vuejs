<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
      <tr>
        <slot name="columns" :columns="columns">
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </slot>
      </tr>
    </thead>
    <tbody :class="tbodyClasses">
      <tr v-for="(item, index) in data" :key="index" @click="rowClick(item)">
        <slot :row="item" :index="index">
          <td
            v-for="(column, index) in colsWithValue(item)"
            :key="index">
            {{ itemValue(item, column) }}
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: 'base-table',
  props: {
    columns: {
      type: Array,
      default: () => [],
      description: 'Table columns'
    },
    data: {
      type: Array,
      default: () => [],
      description: 'Table data'
    },
    type: {
      type: String, // striped | hover
      default: '',
      description: 'Whether table is striped or hover type'
    },
    tableClasses: {
      type: String,
      default: '',
      description: '<table> css classes'
    },

    theadClasses: {
      type: String,
      default: '',
      description: '<thead> css classes'
    },
    tbodyClasses: {
      type: String,
      default: '',
      description: '<tbody> css classes'
    }
  },
  computed: {
    tableClass() {
      const typeClass = this.type && `table-${this.type}` ;
      console.log(typeClass)
      return  typeClass + this.tableClasses;
    },
    colsWithValue() {
      return (row) => {
        return this.columns.filter(column => this.hasValue(row, column))
      }
    }
  },
  updated() {
    this.addLabelsToTable();
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== 'undefined';
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    addLabelsToTable() {
      const thEls = this.$el.querySelectorAll('thead th');

      const tdLabels = Array.from(thEls).map(el => el.innerText);

      this.$el.querySelectorAll('tbody tr').forEach( tr => {
        Array.from(tr.children).forEach(
          (td, ndx) => {

            td.setAttribute('label', tdLabels[ndx]);

          }
        );
      });
    },

    rowClick(item) {
      this.$emit('tr-click', item);
    }
  }
};
</script>
<style scoped>

  @media screen and (max-width: 600px) {
    table.mobile {
      max-width: 100%;
    }

    table.mobile thead {
      display: none;
    }

    table.mobile tr, table.mobile td {
      border-bottom: 1px solid #ddd;
    }

    table.mobile tr {
      margin-bottom: 10px;
    }

    table.mobile td {
      display: flex;

      text-overflow: clip ;
    }

    table.mobile td::before {
      content: attr(label);
      font-weight: bold;
      width: 90px;
      min-width: 90px;
    }
  }
</style>
