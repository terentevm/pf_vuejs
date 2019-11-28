<template>
    <ul class="list">
        <li v-for="(item,index) in elements" :key="index">
            <div class="list-row">
                <div class="list-row-ava-letter">
                    <span>{{ item.itemName.trim()[0].toUpperCase() }}</span>
                </div>

                <div class="list-row-content">
                    <span>{{ item.itemName }}</span>
                </div>

                <div class="list-row-sum">
                    <span>{{ item.sumConverted }}</span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
  props: {
    elements: Array,
    roundColor: String,
  },
};
</script>

<style scoped>
.list {
  list-style: none;
}

.list-row {
  display: flex;
  flex-direction: row;
  flex-grow: 5;
  justify-content: flex-start;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 50px 0 0 50px;
}

.list-row:hover {
  background-color: rgb(240, 240, 240);
}

.list-row-ava-letter {
  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  text-align: center;
  vertical-align: middle;
  background-color: tomato;
  border-radius: 50%;

  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
}

.list-row-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  flex-grow: 3;

  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
  color: #43425d;
}

.list-row-sum {
  display: flex;
  flex-direction: row;
  /* flex-grow: 1; */
  justify-content: right;
  align-items: center;
  margin-right: 20px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 1.2rem;
  color: #43425d;
}
</style>
