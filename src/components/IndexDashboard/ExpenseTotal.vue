<template>
    <div class="card mt-1">
        <div class="card-header bg-transparent dash-card-header-title">
            Expenses
        </div>

        <div class="card-body d-flex flex-row justify-content-between align-items-center">
            <div>
                <div class="headline">{{ expensesRounded }}</div>
                <div class="grey--text">{{ expenseCurrency.short_name }}</div>
            </div>

            <img src="../../assets/graph_expenses.svg" height="64px" width="64px">

        </div>

    </div>
</template>

<script>

    import Mynum from '../../helpers/MyNum';

    export default {
        props: ['totalExpenses', 'expenseCurrency'],
        computed: {
            expensesRounded: function () {
                return Mynum.round2(this.totalExpenses);
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
