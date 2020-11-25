import Vue from 'vue';
import Vuetify from 'vuetify/lib';


import VAvatar from 'vuetify/lib/components/VAvatar';
import VBtn from 'vuetify/lib/components/VBtn';
import VCard from 'vuetify/lib/components/VCard';
import VCardActions from 'vuetify/lib/components/VCard';
import VCardText from 'vuetify/lib/components/VCard';
import VCardTitle from 'vuetify/lib/components/VCard';
import VCheckbox from 'vuetify/lib/components/VCheckbox';
import VContainer from 'vuetify/lib/components/VGrid';
import VDialog from 'vuetify/lib/components/VDialog';
import VDivider from 'vuetify/lib/components/VDivider';
import VFlex from 'vuetify/lib/components/VGrid';
import VIcon from 'vuetify/lib/components/VIcon';
import VItem from 'vuetify/lib/components/VItemGroup';
import VItemGroup from 'vuetify/lib/components/VItemGroup';
import VLabel from 'vuetify/lib/components/VLabel';
import VLayout from 'vuetify/lib/components/VGrid';
import VList from 'vuetify/lib/components/VList';
import VListGroup from 'vuetify/lib/components/VList';
import VListTile from 'vuetify/lib/components/VList';
import VListTileAction from 'vuetify/lib/components/VList';
import VListTileActionText from 'vuetify/lib/components/VList';
import VListTileAvatar from 'vuetify/lib/components/VList';
import VListTileContent from 'vuetify/lib/components/VList';
import VListTileSubTitle from 'vuetify/lib/components/VList';
import VListTileTitle from 'vuetify/lib/components/VList';
import VMessages from 'vuetify/lib/components/VMessages';
import VProgressLinear from 'vuetify/lib/components/VProgressLinear'; //Global
import VSnackbar from 'vuetify/lib/components/VSnackbar';
import VSpacer from 'vuetify/lib/components/VGrid';
import VSubheader from 'vuetify/lib/components/VSubheader';
import VToolbar from 'vuetify/lib/components/VToolbar';
import VToolbarItems from 'vuetify/lib/components/VToolbar';
import VToolbarSideIcon from 'vuetify/lib/components/VToolbar';
import VToolbarTitle from 'vuetify/lib/components/VToolbar';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';
Vue.use(Vuetify);
// const mainColor = '#43425D';
const mainColor = '#435d7d';

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red.darken1, // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base,
        appColor: '#435d7d'// #3F51B5
      },
    },
    appColor: mainColor,
  },

  components: {
    VAvatar,
    VContainer,
    VFlex,
    VLayout,
    VBtn,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VCheckbox,
    VDialog,
    VDivider,
    VIcon,
    VItem,
    VItemGroup,
    VLabel,
    VList,
    VListTile,
    VListTileAction,
    VListTileActionText,
    VListTileAvatar,
    VListGroup,
    VListTileContent,
    VListTileSubTitle,
    VListTileTitle,
    VMessages,
    VProgressLinear,
    VSnackbar,
    VSpacer,
    VSubheader,
    VToolbar,
    VToolbarSideIcon,
    VToolbarTitle,
    VToolbarItems
  }
});
