<template>
    <div class="row" @click="titleClickHandler">
        <div v-if="isGroup === true" class="list-elem">
            <i v-if="this.item.collapsed == true" class="material-icons" v-bind:style="{color: colorApp}" @click="iconClickHandler">
                add_circle_outline
            </i>
            <i v-if="this.item.collapsed == false" class="material-icons" v-bind:style="{color: colorApp}" @click="iconClickHandler">
                remove_circle_outline
            </i>
            <span class="list_item_title" @click="titleClickHandler">{{ this.title }}</span>
        </div>
        <div v-if="isGroup === false" class="list-elem">
            <i class="material-icons" v-bind:style="{color: colorApp}">
                remove_circle_outline
            </i>
            <span class="list_item_title" v-bind:class="{ not_active: !this.item.active }" @click="titleClickHandler">{{ this.title }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TMListElement",
        props:{
            title: {
                type: String,
                default: ''
            },
            isGroup: {
                type: Boolean,
                default: false
            },
            item: {
                type: Object
            }
        },
        data: () => ({
            colorApp: ''
        }),
        beforeMount: function () {
            this.colorApp = this.$vuetify.theme.appColor;
        },
        methods:{
            iconClickHandler(e) {
                e.stopPropagation();
                this.item.collapsed = !this.item.collapsed;
            },

            titleClickHandler()
            {
                this.$emit('itemclick', this.item);
            }
        }
    }
</script>

<style scoped>
    .list-elem {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 20px;
        margin-right: 20px;
        width: 100%;
        height: 40px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .list-elem:hover {
        cursor: pointer;
        background-color: rgb(245, 245, 245);
    }

    .list_item_title {
        margin-left: 10px;
    }

    .not_active {
        color: #78909c;
        text-decoration: line-through;
    }

</style>