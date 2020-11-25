const mixin = {
  data: () => ({
    selected: [],
    formModified: false
  }),

  methods: {
    copyRows() {
      this.selected.forEach(item => {
        const newRow = Object.assign({}, item);
        newRow.id = null;
        newRow.index = null;
        this.$store.commit('expenseEditRow', newRow);
      })
    },

    deleteSelRows() {
      this.$store.commit('deleteSelected', this.selected);
    },

    setFormModified(value) {
      this.formModified = value;
    }
  }
};

export default mixin;