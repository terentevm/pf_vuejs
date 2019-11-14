<template>

    <div class="card mt-1">
        <div class="card-header bg-transparent dash-card-header-title">
            Incomes
        </div>

        <div class="card-body d-flex flex-row justify-content-between align-items-center">
            <div>
                <div class="headline">{{ incomesRounded }}</div>
                <div class="grey--text">{{ totalIncomesCurrency.short_name }}</div>
            </div>

            <img src="../../assets/graph_income.svg" height="64px" width="64px">

        </div>

    </div>

</template>

<script>
    import Mynum from '../../helpers/MyNum';

    export default {
        props: ['totalIncomes', 'totalIncomesCurrency'],

        computed: {
            incomesRounded: function () {
                return Mynum.round2(this.totalIncomes);
            },
        },
    };
</script>
