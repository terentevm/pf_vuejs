<template>
    <v-dialog
        v-model="showWalletSelection"
        scrollable
        max-height="300px"
        max-width="400px"
        persistent
        :fullscreen="$vuetify.breakpoint.smAndDown"
    >
        <v-card class="wallet-sel-dialog">
            <v-toolbar color="appColor" dark scroll-target="#scrolling-techniques">
                <v-avatar tile :size="32">
                    <img src="@/assets/wallet.png" alt="wallet-icon">
                </v-avatar>
                <v-toolbar-title>Select a wallet (account)</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close(undefined)">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <tm-tree
                    :items="items"
                    @itemclick="close"
                ></tm-tree>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import picElement from '@/assets/list_element.png';
    import TMTree from '../TMComponents/TMList/TMTree';

    export default {
        components: {
            'tm-tree': TMTree
        },
        props: {
            items: {
                type: Array,
                default: () => []
            },
            showWalletSelection: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            picElement: picElement,
        }),
        methods: {
            close(wallet) {
                this.$emit('select-wallets-close', wallet);
            },
        },
    };
</script>
