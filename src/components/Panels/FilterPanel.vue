<template>
  <div>
    <div id="filter-panel" class="row align-center py-0">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 d-flex mx-0 px-1">
        <my-input
          :id="'filter_period_input'"
          v-model="periodText"
          :placeholder="'Period'"
          :size="'sm'"
          :read-only="true"
          @clear="periodOnClear"
          @select="periodOnSelect"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 d-flex mx-0 px-1">
        <tm-select
          id="settings_main_wallet_el"
          v-model="walletFilter"
          :size="'sm'"
          :options="wallets"
          :title="'name'"
          :clearable="true"
          :select-btn="true"
          :placeholder="'Wallet filter'"
          :prepend-icon="'fas fa-wallet'"

        />
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import MyInput from '../TMComponents/TMInput/Input';
  export default {
    name: 'filter-panel',
    components: {
      'my-input': MyInput
    },
    data: () => ({
      walletFilter: '',
      period: {
        begin: '2020-01-01',
        end: '2020-12-31'
      },
      periodText: 'All period',
    }),
    computed: {
      ...mapGetters({
        wallets: 'allWallets'
      }),
    },
    watch: {
      walletFilter: function(newValue, oldValue) {
        console.log('wallet changed');
        if (!newValue) {
          this.$emit('wallet-change', null);
          return;
        }

        if (!oldValue || newValue.id !== oldValue.id) {
          this.$emit('wallet-change', newValue);
        }


      }
    },
    async beforeMount() {
      await this.$store.dispatch('getAllWallets');
    },

    methods: {
      periodOnSelect() {
        this.$dialog
          .confirm('Please confirm to continue', {
            view: 'period-selection',
            ...this.period
          })
          .then((result) => {
            this.period = result.data;
            this.periodText = `${result.data.begin}  -  ${result.data.end}`;

            this.$emit('period-change', this.period);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      periodOnClear() {

        this.period = {};
        this.periodText = 'All period'
        this.$emit('period-change', null);
      },
    }

  }
</script>

<style scoped>

</style>