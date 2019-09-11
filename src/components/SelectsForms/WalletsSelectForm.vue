<template>
    <v-dialog v-model="showWalletSelection" width="400" scrollable persistent>
        <v-card class="wallet-sel-dialog">
            <v-toolbar color="appColor" dark scroll-target="#scrolling-techniques">
                <v-avatar tile :size="32">
                    <img src="@/assets/wallet.png" alt="wallet-icon"/>
                </v-avatar>
                <v-toolbar-title>Select a wallet (account)</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close(undefined)">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <tm-tree
                    :items="items"
                    @itemclick="close"
            ></tm-tree>

        </v-card>
    </v-dialog>
</template>

<script>
    import picElement from '@/assets/list_element.png';
    import TMTree from '../Reusable/TMList/TMTree';

    export default {
        props: ['items', 'showWalletSelection'],
        data: () => ({
            picElement: picElement,
        }),
        components: {
            'tm-tree': TMTree
        },
        methods: {
            close(wallet) {
                this.$emit('select-wallets-close', wallet);
            },
        },
    };
</script>

<style>
    .wallet-sel-dialog {
        background: #fff;
        min-height: 100vh;
    }
</style>