<template>
    <div class="tm_select_wrapper" v-bind:class="{focused: inputFocused == true}">


        <div class="tm_select_input_wrapper">

            <input
                    v-bind="scope.search.attributes"
                    class="tm_select_input"
                    v-on="scope.search.events"
            >

            <div class="tm_select_actions">
                <div class="arrow_wrap" v-if="!readOnly" v-on:click="toogleList">

                    <span v-if="showList == false" class="arrow_up_down">
                        <component :is="childComponents.ArrowDown" class="tm_icon"/>
                    </span>
                    <span v-if="showList === true" class="arrow_up_down">
                        <component :is="childComponents.ArrowUp" class="tm_icon"/>
                    </span>
                </div>
                <div v-if="clearable && !readOnly" class="tm_select_btn_wrapper">
                    <button class="tm_select_btn" type="button" v-on:click="clear">
                        <component :is="childComponents.Clear" class="tm_icon"/>
                    </button>
                </div>
                <div v-if="selectBtn && !readOnly" class="tm_select_btn_wrapper">
                    <button class="tm_select_btn" type="button" v-on:click="btnOpenOnClick">
                        <component :is="childComponents.OpenIcon" class="tm_icon"/>
                    </button>
                </div>
            </div>
        </div>


        <ul class="tm_select_dropdown" :class="{tm_select_dropdown_none: !showList}">
            <li
                    class="tm_select_dropdown_item"
                    v-for="item in filteredList"
                    :key="item.id"
                    @click="chooseItem(item)"

            >
                <span class="tm_select_dropdown_item_title">{{ item[title] }}</span>
            </li>
        </ul>

    </div>
</template>

<script>
    import childComponents from './childComponents';

    export default {
        name: "TMSelect",

        props: {
            id: {
                type: String,
                reqired: true
            },

            options: {
                type: Array,
                reqired: true,
                default: []
            },

            objects: {
                type: Boolean,
                default: true
            },

            title: {
                type: String,
                reqired: true
            },

            placeholder: {
                type: String,
                default: ''
            },

            value: {
                reqired: true
            },

            autocomplete: {
                type: Boolean,
                default: false
            },

            readOnly: {
                type: Boolean,
                default: false
            },

            clearable: {
                type: Boolean,
                default: false
            },

            selectBtn: {
                type: Boolean,
                default: true
            }
        },
        data: () => ({
            showList: false,
            search: '',
            currentValue: undefined,
            inputFocused: false,
        }),

        components: {...childComponents},

        computed: {
            filteredList() {
                return this.options.filter(value => {

                    if (value instanceof Object && value.hasOwnProperty(this.title)) {

                        return typeof this.search === 'string'
                            ? value[this.title].toLowerCase().indexOf(this.search.toLowerCase()) != -1
                            : true;


                    }
                    else {
                        return typeof this.search === 'string'
                            ? value.toString().toLowerCase().indexOf(this.search.toLowerCase()) != -1
                            : true;
                    }


                });
            },
            childComponents() {
                return {
                    ...childComponents
                };
            },

            scope() {
                return {
                    search: {
                        attributes: {
                            'id': this.id,
                            'placeholder': this.placeholder,
                            'readonly': this.readOnly,
                            'value': typeof this.search == 'string' ? this.search.trim() : this.search,
                            'ref': 'search',
                            'aria-label': 'Search for option',
                            'role': 'combobox',
                            'type': 'search',
                            'autocomplete': 'off',
                        },
                        events: {
                            'focus': this.onFocus,
                            'blur': this.inputBlur,
                            'input': this.onInput,
                            'keydown': this.onSearchKeyDown,
                            'keyup': this.onSearchKeyUp
                        }
                    }
                }
            }
        },

        watch: {
            value(value) {
                this.setSearchFromValue(value);
                this.setCurrentValue(value);
            }
        },

        mounted() {
            document.addEventListener('click', this.closeMenu)

            this.setSearchFromValue(this.value);
            this.setCurrentValue(this.value);
        },

        beforeDestroy() {
            document.removeEventListener('click', this.closeMenu)
        },

        methods: {
            toogleList(e) {
                this.chooseItem(undefined, true);
            },

            onFocus(e) {
                if (this.readOnly === true) {
                    return;
                }
                this.inputFocused = true;
                this.search = '';
                this.showList = true;
            },

            inputBlur(e) {
                this.inputFocused = false;
            },

            onInput(e) {
                this.search = e.target.value;
                this.showList = true;
            },

            onSearchKeyDown(e) {
                switch (e.keyCode) {
                    case 8:
                        e.preventDefault();
                        return this.deleteHandler(e);

                    case 9:
                        //  tab
                        return this.onTab();
                }
            },
            onSearchKeyUp(e) {
                switch (e.keyCode) {
                    case 27:
                        //  esc
                        return this.onEscape(e);
                    case 13:
                        //  enter.prevent
                        e.preventDefault();
                        return this.onEnter();
                }
            },
            onTab() {
                if (this.showList === true) {
                    this.chooseItem(undefined, true);
                }
            },

            onEscape(e) {
                e.stopPropagation();
                if (this.showList === true) {
                    this.chooseItem(undefined, true);
                }

            },

            onEnter() {

                if (this.showList === true) {

                    if (this.filteredList.length === 1) {
                        this.chooseItem(this.filteredList[0], false);
                    }

                }

            },

            setSearchFromValue(value) {

                if (value instanceof Object && value.hasOwnProperty(this.title)) {
                    this.search = value[this.title];
                }
                else {

                    this.search = value;
                }

            },

            setCurrentValue(value) {

                this.currentValue = value;
            },

            chooseItem(item, clickOutside = false) {

                if (item === undefined || clickOutside === true) {

                    if (this.currentValue && this.currentValue !== undefined) {
                        item = Object.assign({}, {...this.currentValue});
                    }



                }

                this.setSearchFromValue(item);
                this.setCurrentValue(item);

                this.$emit('input', item);

                this.showList = false;
            },

            closeMenu(e) {

                if (!this.$el.contains(e.target)) {
                    if (this.showList) {
                        this.chooseItem(undefined, true);
                    }

                }

            },

            clear(e) {
                this.search = '';

                if (this.showList === true) this.showList = false;

                this.$emit('input', null);
            },

            deleteHandler(e) {
                e.stopPropagation();
                console.dir(e);
                console.dir(e.target);
                console.log(this.search);

                if (typeof this.search === 'string' && this.search.length > 0) {
                    this.search = this.search.slice(0, -1);
                }

            },

            btnOpenOnClick(e) {
                this.$emit('open');
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../style/variables";

    .tm_select_wrapper {
        box-sizing: border-box;
        position: relative;
        width: 100%;
    }

    .tm_select_input_wrapper {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        width: 100%;

        border: $tm_wrap_border;
        border-radius: 4px;
        padding-right: 5px;
    }

    .tm_select_input {
        display: block;
        position: relative;

        flex: 1 1 auto;
        width: 1%;
        height: $tm_component_height;
        margin: 0;
        padding-left: 10px;
        font-size: $tm_input_font-size;

    }
    .focused{
        box-shadow: $tm_input_focus_shadow;
    }

    .tm_select_input:focus {
        outline: none;
    }

    .tm_select_actions {
        display: flex;
    }

    .tm_icon {
        fill: $tm_icon_color;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
    }

    .tm_icon:hover {
        fill: $tm_icon_hover_color;
    }

    .arrow_wrap {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 20px;
    }

    .tm_select_btn_wrapper {
        margin: 0;
        padding: 0;
        height: 50px;
    }

    .tm_select_btn {
        width: 30px;
        height: 100%;
        outline: none;
    }

    .tm_select_dropdown {
        display: block;
        position: absolute;
        left: 0;
        top: calc(100% + 0.25rem);
        z-index: 1;
        border-radius: 4px;
        width: 100%;
        min-width: 10rem;
        max-height: 350px;
        overflow-y: auto;
        background: #FFFFFF;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .tm_select_dropdown_item:first-child {
        margin-top: 0.25rem;
    }

    .tm_select_dropdown_item {
        display: flex;
        margin: 0 0.25rem;
        border-radius: 4px;
        align-items: center;
        cursor: pointer;
        height: 50px;
    }

    .tm_select_dropdown_item:hover {
        background-color: #F0F0F0;
    }

    .tm_select_dropdown_item_title {
        font-size: $tm_input_font-size;
        margin-left: 10px;
    }

    .tm_select_dropdown_none {
        display: none;
    }

</style>