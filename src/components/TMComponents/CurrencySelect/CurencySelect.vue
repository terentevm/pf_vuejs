<template>
  <div :id="id" class="lang input-lang-wrapper">
    <button
      type="button"
      class="lang btn-block mt-2 btn-lang-select"
      @click="showDropdown = !showDropdown"
    >
      <svg class="lang" width="32px" height="32px">
        <use class="lang" :xlink:href="selectedSvgId"/>
      </svg>
      <span class="lang lang-selected-currency">{{ selectedTitle }}</span>
      <span class="lang flag-select-arrow" :class="{turned: showDropdown}"></span>
    </button>
    <ul
      v-if="showDropdown"
      class="lang lang-select-dropdown"
      @blur="showDropdown = !showDropdown"
    >
      <li
        v-for="(item,index) in currencyList"
        :key="index"
        class="lang lang-select-dropdown-item"
        @click="selectHandler(item)"
      >
        <svg class="lang lang-select-dropdown-item-flag" width="30px" height="30px">
          <use :xlink:href="item.svgId"/>
        </svg>
        <span class="lang lang-select-dropdown-item-title">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'CurencySelectVue',
    props: {
      id: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        showDropdown: false,
        selectedTitle: 'CZK',
        selectedSvgId: '#czk',
        currencyList: [
          {
            title: 'RUB',
            svgId: '#rub'
          },
          {
            title: 'CZK',
            svgId: '#czk'
          },
          {
            title: 'EUR',
            svgId: '#eur'
          }
        ],
        classList: {},
        listener: null
      };
    },

    mounted: function () {
      this.listener = function (e) {
        if ([...e.target.classList].indexOf('lang') === -1 && this.showDropdown === true) {

          this.showDropdown = false;

        }
      }.bind(this);

      window.addEventListener('click', this.listener);

      this.$emit('change', this.selectedTitle)

    },

    beforeDestroy: function () {

      window.removeEventListener('click', this.listener);

    },

    methods: {
      selectHandler(item) {
        this.selectedTitle = item.title;
        this.selectedSvgId = item.svgId;
        this.showDropdown = false;

        this.$emit('change', item.title)
      },
    }
  }
</script>


<style scoped lang="scss">
  .input-lang-wrapper {
    position: relative;
    display: flex;
  }

  .btn-lang-select {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 40px;
    background-color: #f2f2f2;
    border-radius: 10px;

    padding-left: 5px;
    padding-right: 15px;
    z-index: 2000;
  }

  .flag-icon {
    background-size: contain;
    cursor: pointer;
    display: inline-block;
    height: 32px;
    width: 32px;
    margin-left: 5px;
  }

  .lang-selected-currency {
    display: block;
    flex-grow: 1;
    text-align: start;
    margin-left: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: 20px;

  }

  .flag-select-arrow {
    background: url('../../../assets/flags/down-arrow.svg') no-repeat top right;
    background-size: contain;
    cursor: pointer;
    display: inline-block;
    height: 16px;
    width: 16px;
  }

  .turned {
    background: url('../../../assets/flags/up-arrow.svg') no-repeat top right;
  }

  .lang-select-dropdown {
    display: block;
    position: absolute;
    left: 0;
    top: calc(100% + 0.25rem);
    z-index: 1;
    border-radius: 4px;
    width: 100%;
    min-width: 10rem;
    background: #FFFFFF;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .lang-select-dropdown-item:first-child {
    margin-top: 0.25rem;
  }

  .lang-select-dropdown-item {
    display: flex;
    margin: 0 0.25rem;
    border-radius: 4px;
    align-items: center;
    cursor: pointer;
    height: 50px;
  }

  .lang-select-dropdown-item:hover {
    background-color: #F0F0F0;
  }

  .lang-select-dropdown-item-flag {
    margin-left: 5px;

  }

  .lang-select-dropdown-item-title {
    font-size: 20px;
    margin-left: 10px;
  }


</style>