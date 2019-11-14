<template>
    <div class="cbx_wrapper">
        <label class="tm_checkBox_label">
            <input type="checkbox" v-model="cbxValue">
            <span class="tm_checkbox_custom"></span>
        </label>
    </div>

</template>

<script>
    export default {
        name: "TMCheckbox",
        props: {
            value: {
                type: Boolean,
                required: true
            }
        },

        computed: {
            cbxValue: {
                get() {
                    return this.value;
                },

                set(newVal) {
                    this.$emit('input', newVal);
                }
            }
        }

    }
</script>

<style scoped lang="scss">
   @import "style/variables";
    .cbx_wrapper {
        position: relative;
    }
    .tm_checkBox_label {
        display: block;
        position: relative;
        margin: auto;
        cursor: pointer;
        font-size: 22px;
        line-height: 24px;
        height: 24px;
        width: 24px;
        clear: both;
    }

    .tm_checkBox_label input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    .tm_checkBox_label .tm_checkbox_custom  {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 24px;
        width: 24px;
        background-color: transparent;
        border-radius: 5px;
        transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
        -moz-transition: all 0.3s ease-out;
        -ms-transition: all 0.3s ease-out;
        -o-transition: all 0.3s ease-out;
        border: $tm_checkbox_border;
    }

    .tm_checkBox_label .tm_checkbox_custom::after {
        position: absolute;
        content: "";
        left: 12px;
        top: 12px;
        height: 0px;
        width: 0px;
        border-radius: 5px;
        border: solid #435d7d;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(0deg) scale(0);
        -ms-transform: rotate(0deg) scale(0);
        transform: rotate(0deg) scale(0);
        opacity: 1;
    }

    .tm_checkBox_label input:checked ~ .checkbox-custom {
        background-color: #FFFFFF;
        border-radius: 5px;
        -webkit-transform: rotate(0deg) scale(1);
        -ms-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1);
        opacity:1;
        border: 2px solid #FFFFFF;
    }


    .tm_checkBox_label .tm_checkbox_custom::after {
        position: absolute;
        content: "";
        left: 12px;
        top: 12px;
        height: 0px;
        width: 0px;
        border-radius: 5px;
        border: solid #435d7d;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(0deg) scale(0);
        -ms-transform: rotate(0deg) scale(0);
        transform: rotate(0deg) scale(0);
        opacity:1;
        transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
        -moz-transition: all 0.3s ease-out;
        -ms-transition: all 0.3s ease-out;
        -o-transition: all 0.3s ease-out;
    }


    .tm_checkBox_label input:checked ~ .tm_checkbox_custom::after {
        -webkit-transform: rotate(45deg) scale(1);
        -ms-transform: rotate(45deg) scale(1);
        transform: rotate(45deg) scale(1);
        opacity:1;
        left: 8px;
        top: 3px;
        width: 6px;
        height: 12px;
        border: solid #558B2F;
        border-width: 0 2px 2px 0;
        background-color: transparent;
        border-radius: 0;
    }


</style>