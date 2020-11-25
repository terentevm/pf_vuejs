<template>
  <div>
    <v-dialog
      v-model="showWalletSelection"
      attach=".wrapper"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      :max-width="'400px'"
    >
      <card :bodyClasses="bodyClasses" :headerClasses="headerClasses">
        <div slot="header" class="row align-items-center">
          <div class="col">
            <h5 class="h3 mb-0">Select a wallet</h5>
          </div>
          <base-button
            type="secondary"
            outline 
            data-dismiss="modal"
            aria-label="Close"
            @click="cancel"
          >
            <span>×</span>
          </base-button>
        </div>
    
        <tm-tree
          :items="items"
          @itemclick="close"
        />
      </card>
    </v-dialog>
  </div>
</template>

<script>
    import picElement from '@/assets/list_element.png';
    import VDialog from 'vuetify/lib/components/VDialog';
    import TMTree from '../TMComponents/TMList/TMTree';
    import Card from '../../argon/src/components/Card';
    import BaseButton from '../../argon/src/components/BaseButton';
    export default {
        components: {
          VDialog,
          Card,
          BaseButton,
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
            bodyClasses: ['px-0'],
            headerClasses: ['py-1']
        }),
      
        methods: {
            close(wallet) {
                this.$emit('select-wallets-close', wallet);
            },
            cancel() {
              this.$emit('select-wallets-close', undefined);
            }
        },
    };
</script>
<style lang="css">
.con-footer {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.con-footer .vs-button {
	margin: 0px;
}

.con-footer .vs-button .vs-button__content {
	padding: 10px 30px;
}

.con-footer .vs-button ~ .vs-button {
	margin-left: 10px;
}

.not-margin {
	margin: 0px;
	font-weight: normal;
	padding: 10px;
	padding-bottom: 0px;
}

.con-content {
	width: 100%;
}

.con-content p {
	font-size: 0.8rem;
	padding: 0px 10px;
}

.con-content .vs-checkbox-label {
	font-size: 0.8rem;
}

.con-content .vs-input-parent {
	width: 100%;
}

.con-content .vs-input-content {
	margin: 10px 0px;
	width: calc(100%);
}

.con-content .vs-input-content .vs-input {
	width: 100%;
}

.footer-dialog {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: calc(100%);
}

.footer-dialog .new {
	margin: 0px;
	margin-top: 20px;
	padding: 0px;
	font-size: 0.7rem;
}

.footer-dialog .new a {
	color: rgba(var(--vs-primary), 1) !important;
	margin-left: 6px;
}

.footer-dialog .new a:hover {
	text-decoration: underline;
}

.footer-dialog .vs-button {
	margin: 0px;
}   
</style>