<template>
    <div class="card">
        <div class="card-header border-bottom-0">
            Money in wallets
        </div>

        <div class="table-responsive">
            <table class="table align-items-center table-flush">
                <thead class="thead-light">
                <tr class="row table-head-line">
                    <th class="col-xs-6 col-md-6 text-left">Name</th>
                    <th class="col-xs-6 col-md-6 text-right">Balance</th>
                </tr>
                </thead>
                <tbody class="thead-light">
                <tr v-for="(item,index) in balanceAll" class="row border-top-1 tr-py">
                    <td class="col-xs-6 col-md-6 text-left">{{ item.wallet_name }}, {{ item.currency_char_code }}</td>
                    <td class="col-xs-6 col-md-6 text-right">{{ item.reportBalance }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

    export default {

        computed: {
            balanceAll: {
                get() {
                    return this.$store.state.dashboard.balanceByWallets.filter(item => {
                        return Number(item.balance) !== 0
                    });
                }
            }
        },


    };
</script>

