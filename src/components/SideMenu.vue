<template>
  <ul id="sidemenu" class="sidemenu">
    <div class="div-btn">
      <a href="#"><i class="material-icons">close</i></a>
    </div>
    <li>{{ showMenu }}</li>
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
    <li><a href="#">Link 3</a></li>
  </ul>
</template>

<style scoped>
.sidemenu {
  transition: box-shadow 0.3s;
  display: block;
  position: fixed;
  list-style: none;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  width: 300px;
  background-image: url('../assets/sidemenubackground.jpeg');
  height: 100%;
  top: 0;
  left: 0;
  transition: left 0.2s;
  z-index: 2;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
}
.sidemenu:hover {
  box-shadow: 0 0 30px rgba(33, 33, 33, 0.2);
}
@media screen and (max-width: 800px) {
  .sidemenu {
    left: -300px;
  }

  .div-btn {
    padding: 0 0 0 250px;
    display: block;
  }

  .content {
    padding: 0 0 0 0;
  }
}

.m_hiden {
  left: -300px;
}

.div-btn {
  padding: 0 0 0 250px;
  display: none;
}
</style>

<script>
export default {
  props: ['showMenu'],
};
</script>
