const template =
  `<div class="modal-confirm">
    <div class="modal-header flex-column">
      <div class="icon-box">

        <img :src="icon" alt="">
      </div>
      <h4 class="modal-title w-100 text-center my-2">{{ messageHeader }}</h4>
    </div>
    <div class="modal-body">

      <p>{{ messageBody }}</p>
    </div>
  </div>`;

  import './tm-alert.css';
  import Vue from 'vue';
  import IconSuccess from './icon_success.svg';
  import IconFailure from './icon_failure.svg';
  import IconWarning from './icon_warning.svg';

  function getIconByType(type) {
    switch (type) {
      case 'success':
        return IconSuccess;
      case 'failure':
        return IconFailure;
      case 'warning':
        return IconWarning;
      default:
        return IconSuccess;
    }
  }
  export default function (props) {

    return Vue.extend({
      data: () => ({
        icon: getIconByType(props.alertType),
        messageHeader: props.msgHeader,
        messageBody: props.msgBody
      }),
      template: template,
    })
  }
