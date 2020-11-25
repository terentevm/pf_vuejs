
  '<div class="modal-confirm">
    <div class="modal-header flex-column">
      <div class="icon-box">

        <img :src="icon" alt="">
      </div>
      <h4 class="modal-title w-100 text-center my-2">Are you sure?</h4>
    </div>
    <div class="modal-body">

      <p>{{ messageBody }}</p>
    </div>
    <div class="modal-footer justify-content-center">
      <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="decline">Cancel</button>
      <button type="button" class="btn btn-danger" @click="confirm">Delete</button>
    </div>
  </div>';


<script>
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
    return {
      name: "alert",
      data: () => ({
        icon: getIconByType(props.alertType)
      }),
    }
  }
</script>

<style scoped>
  .modal-confirm .modal-content {
    padding: 20px;
    border-radius: 5px;
    border: none;
    text-align: center;
    font-size: 14px;
  }
  .modal-confirm .modal-header {
    border-bottom: none;
    position: relative;
  }
  .modal-confirm h4 {
    text-align: center;
    font-size: 26px;
    margin: 30px 0 -10px;
  }

  .modal-confirm .modal-body {
    color: #999;
  }
  .modal-confirm .modal-footer {
    border: none;
    text-align: center;
    border-radius: 5px;
    font-size: 13px;
    padding: 10px 15px 25px;
  }
  .modal-confirm .modal-footer a {
    color: #999;
  }
  .modal-confirm .icon-box {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    z-index: 9;
    text-align: center;
  }
  .modal-confirm .icon-box i {
    color: #f15e5e;
    font-size: 46px;
    display: inline-block;
    margin-top: 13px;
  }
  .btn .btn:active {
    color: #fff;
    border-radius: 4px;
    background: #60c7c1;
    text-decoration: none;
    transition: all 0.4s;
    line-height: normal;
    min-width: 120px;
    border: none;
    min-height: 40px;
    border-radius: 3px;
    margin: 0 5px;
  }

  .modal-confirm .btn-secondary {
    background: #c1c1c1;
  }

  .modal-confirm .btn-secondary:hover, .modal-confirm .btn-secondary:focus {
    background: #a8a8a8;
  }
  .modal-confirm .btn-danger {
    background: #f15e5e;
  }
  .modal-confirm .btn-danger:hover, .modal-confirm .btn-danger:focus {
    background: #ee3535;
  }

</style>