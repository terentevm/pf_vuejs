<template>
    <div class="card mt-1">
        <div class="card-header bg-transparent dash-card-header-title">
            Balance
        </div>

        <div class="card-body d-flex flex-row justify-content-between align-items-center">
            <div>
                <div class="headline">
                    {{ balanceRounded }}
                </div>
                <div class="grey--text">
                    {{ balanceCurrency.short_name }}
                </div>
            </div>

            <img src="../../assets/balance.svg" height="64px" width="64px" alt="...">
        </div>
    </div>
</template>

<script>

    import MyNum from '../../helpers/MyNum';

    export default {
        props: {
            totalBalance: {
                type: Number,
                default: 0
            },
            // eslint-disable-next-line vue/require-default-prop
            balanceCurrency: {
                type: Object
            }
        },

        computed: {
            balanceRounded: function () {
                return MyNum.round2(this.totalBalance);
            },
        },
    };
</script>

<style>
    .dash-card-header-title {
        color: rgb(86, 103, 135);;
        font-family: 'Varela Round', sans-serif;
        font-size: 25px;
        height: 50px;
    }
</style>
