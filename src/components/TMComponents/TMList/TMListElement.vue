<template>
    <div class="row mx-0" @click="titleClickHandler">
        <div v-if="isGroup === true" class="list-elem">
            <i
                v-if="item.collapsed === true"
                class="material-icons"
                :style="{color: colorApp}"
                @click="iconClickHandler"
            >
                add_circle_outline
            </i>
            <i
                v-if="item.collapsed === false"
                class="material-icons"
                :style="{color: colorApp}"
                @click="iconClickHandler"
            >
                remove_circle_outline
            </i>
            <span class="list_item_title" @click="titleClickHandler">{{ title }}</span>
        </div>
        <div v-if="isGroup === false" class="list-elem">
            <i class="material-icons" :style="{color: colorApp}">
                remove_circle_outline
            </i>
            <span
                class="list_item_title"
                :class="{ not_active: !item.active }"
                @click="titleClickHandler"
            >{{ title }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TMListElement',
        props: {
            title: {
                type: String,
                default: ''
            },
            isGroup: {
                type: Boolean,
                default: false
            },
            item: {
                type: Object,
                required: true
            }
        },
        data: () => ({
            colorApp: ''
        }),
        beforeMount: function () {
            this.colorApp = this.$vuetify.theme.appColor;
        },
        methods: {
            iconClickHandler(e) {
                e.stopPropagation();
                this.item.collapsed = !this.item.collapsed;
            },

            titleClickHandler(e) {
                e.stopPropagation();
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
        margin-left: 5px;
        margin-right: 5px;
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