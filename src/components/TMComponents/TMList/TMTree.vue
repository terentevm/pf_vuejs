<script>
  import TMTree from './TMTree';
  import LiElement from './TMListElement';

  export default {
    name: 'TMTree',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      level: {
        type: Number,
        default: 0
      },
      collapsed: {
        type: Boolean,
        default: false
      },
      collapsedIcon: {
        type: String,
        default: ''
      }
    },

    render: function (createElement) {
      let self = this;

      let list_elements = [];
      let style = this.collapsed === true ? 'display: none' : '';

      let margin_left = 10 * this.level;

      style = `${style}; margin-left: ${margin_left}px;`;

      for (let item of this.items) {

        if (item.children instanceof Array && item.children.length > 0) {

          let li = createElement('li', {},
            [
              createElement(LiElement, {
                props: {
                  item: item,
                  title: item.name,
                  isGroup: true
                },
                on: {
                  itemclick: function (itemClicked) {
                    self.$emit('itemclick', itemClicked);
                  },
                  delete: function (itemClicked) {
                    self.$emit('delete', itemClicked);
                  },
                  addsub: function (itemClicked) {
                    self.$emit('addsub', itemClicked);
                  },
                }
              }),
              createElement(TMTree, {
                props: {
                  items: item.children,
                  collapsed: item.collapsed,
                  level: this.level + 1
                },
                on: {
                  itemclick: function (itemClicked) {
                    self.$emit('itemclick', itemClicked);
                  },
                  delete: function (itemClicked) {
                    self.$emit('delete', itemClicked);
                  },
                  addsub: function (itemClicked) {
                    self.$emit('addsub', itemClicked);
                  },
                }
              })
            ]);
          list_elements.push(li);
        }
        else {

          list_elements.push(
            createElement(LiElement, {
              props: {
                title: item.name,
                isGroup: false,
                item: item
              },
              on: {
                itemclick: function (itemClicked) {
                  self.$emit('itemclick', itemClicked);
                },
                delete: function (itemClicked) {
                  self.$emit('delete', itemClicked);
                },
                addsub: function (itemClicked) {
                  self.$emit('addsub', itemClicked);
                },
              }
            })
          );
        }


      }

      return createElement('ul', {
        style: style
      }, list_elements);
    },

  }
</script>

<style scoped>
  li {
    list-style-type: none; /* Убираем маркеры */
    background: #fff;
  }

  ul {
    margin-left: 0; /* Отступ слева в браузере IE и Opera */
    padding-left: 0; /* Отступ слева в браузере Firefox, Safari, Chrome */
    background: #fff;
  }

</style>