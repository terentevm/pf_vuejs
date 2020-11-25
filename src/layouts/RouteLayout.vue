<template lang="html">
  <div>
    <div class="container--fluid pt-0 px-1 px-md-3">
      <card type="secondary" class="mt-1" :header-classes="headerClasses" :body-classes="bodyClasses">
        <div slot="header" class="row align-items-center"> 
          <div class="col">
            <h4 class="text-default text-uppercase ls-1 mb-1">{{ $route.name }}</h4>
          </div>
          <div class="col">
            <ul class="nav justify-content-end d-none d-md-flex flex-row align-center">

              <li v-if="filter" class="nav-item mr-2">
                <span class="filter" :class="{filter_active: filterActive}">
                  <i class="fas fa-filter" @click="filter.toggle"></i>
                </span>
              </li>
              <li class="nav-item mr-2 mr-md-0">
                <tm-button
                  v-if="mainAction"
                  size="sm"
                  color="bg-green-dark"
                  @click.stop="mainAction.action"
                >
                  <span class="d-none d-md-block"><i :class="mainAction.icon"></i> {{ mainAction.title }}</span>
                </tm-button>
              </li>
              <base-dropdown v-if="menuTop.length > 0" position="right" class="ml-2">
                <tm-button
                  slot="title"
                  icon="fas fa-ellipsis-v fa-lg"
                >
                  More
                </tm-button>

                <div
                  v-for="(act, index) in menuTop"
                  :key="index"
                  class="dropdown-item d-flex flex-row"
                  @click="act.action"
                >
                  <i :class="act.icon"></i>
                  {{ act.title }}
                </div>

              </base-dropdown>
            </ul>
          </div>
          <v-progress-linear
            v-if="pending"
            buffer-value="0"
            color="#4193F2"
            indeterminate
            rounded
          />
        </div>
        <router-view />
      </card>
    </div>
  </div>
</template>

<script>
import Card from '../argon/src/components/Card';
import VProgressLinear from 'vuetify/lib/components/VProgressLinear';
import BaseDropdown from '../argon/src/components/BaseDropdown';
import TMButton from '@/components/TMComponents/TMButton/TMButton';
export default {
  components: {
    Card,
    BaseDropdown,
    'tm-button': TMButton,
    VProgressLinear,  
  },
  props: {
    mainAction: {
      type: Object
    },
    menuTop: {
      type: Array,
      default: function () {
        return [];
      }
    },
    filter: {
      type: Object
    },
  },
  data: () => ({
    headerClasses: ['bg-transparent py-0'],
    bodyClasses: ['px-0 pt-0']
  }),
  computed: {
    pending: {
      get() {
        return this.$store.state.app.pending;
      }
    },
    filterActive: {
      get() {
        return this.$store.state.app.filterIsActive;
      }
    },
    styleFilter() {
      return {
        color: this.filterActive === true ? '#ffd600' : 'bg-gray-600',
        fontSize: '24px'
      }
    }
  }
}
</script>
<style lang="css" scoped>

  .filter {
    color: #8898aa;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
  }
  .filter_active {
    color: #ffd600;
  }
</style>