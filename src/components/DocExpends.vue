<template>
    <div v-scroll:#scroll-target="onScroll">
        <v-container class="scroll-y" id="scroll-target">
            <v-layout
                wrap
                v-scroll:#scroll-target="onScroll"
                style="height: 1000px"           
            >
                <v-flex xs12 sm12 md12 lg12>
                    <v-btn color="primary" dark  to='/expend' class="mb-2">Add<v-icon dark right>add</v-icon></v-btn>
                    <v-data-table
                    :headers="headers"
                    :items="items"
                    hide-actions
                    class="elevation-1"
                    >
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        items: [],
        headers: [
        { text: 'id', value: 'id' , class: 'd-none'},
        { text: 'Date', value: 'date'},
        { text: 'Wallet', value: 'wallet'},
        { text: 'Sum', value: 'sum'},
      ],
    }),

    methods: {
        onScroll() {}
    }
}
</script>