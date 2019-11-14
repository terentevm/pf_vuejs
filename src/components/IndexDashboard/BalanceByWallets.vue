<template>
    <div class="card mt-2">

        <div class="card-header bg-transparent dash-card-header-title">
            Money in wallets
        </div>

        <ul class="list-group list-group-flush">
            <li v-for="item in balanceAll" class="list-group-item pr-0">
                <div class="list-row">

                    <div class="list-column-content">
                        <div class="list-row-content">
                            <span>{{ item.wallet_name }}</span>
                        </div>
                        <div class="list-row-content content-second">
                            <span>{{ item.currency_char_code }}</span>
                        </div>
                    </div>

                    <div class="list-column-sum">
                        <div class="list-row-sum">
                            <span>{{ item.reportBalance }}</span>
                        </div>

                        <div class="list-row-sum content-second">
                            <span>{{ item.balance }}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

    export default {

        computed: {
            balanceAll: {
                get() {
                    return this.$store.state.dashboard.balanceByWallets.filter(item => {
                        return Number(item.balance) != 0
                    });
                }
            }
        },


    };
</script>

<style scoped>
    .header-title {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 20px;
        height: 30px;
    }

    .list-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 40px;

    }

    .list-column-content {
        display: flex;
        flex-direction: column;
        flex-grow: 3;

    }

    .list-row-content {
        display: flex;
        flex-direction: row;
        align-items: center;

        font-family: 'Roboto';
        font-weight: 400;
        font-size: 1rem;
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
        font-size: 1rem;
        color: #43425d;
    }

    .content-second {
        font-size: 1rem;
        color: darkgrey;
    }
</style>
