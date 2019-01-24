<template>
  <v-dialog v-model="showWalletSelection" width="400" scrollable persistent>
    <v-card>
      <v-toolbar color="#43425D" dark scroll-target="#scrolling-techniques">
        <v-avatar tile :size="32">
          <img src="@/assets/wallet.png" alt="wallet-icon" />
        </v-avatar>
        <v-toolbar-title>Select a wallet (account)</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close(undefined)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list dense id="scrolling-techniques" class="scroll-y">
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.title" avatar @click="close(item)">
            <v-list-tile-avatar size="24">
              <img :src="picElement" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title
                >{{ item.name }} ({{ item.Currency.short_name }})</v-list-tile-title
              >
            </v-list-tile-content>
          </v-list-tile>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import picElement from '@/assets/list_element.png';

export default {
  props: ['items', 'showWalletSelection'],
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
