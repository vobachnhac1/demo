<template>
  <v-navigation-drawer
    v-model="drawer"
    class="navigation-drawer"
    fixed
    :width="width"
  >
    <v-container class="app-wrapper" grid-list-md fluid text-xs-center>
      <v-layout row wrap class="block">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex md7>
              <v-text-field class="search_textfield" />
            </v-flex>
            <v-flex md3>
              <v-btn class="btn_ui" @click="handleBtnSearchClick">
                Get App
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex md7>
              <v-text-field class="search_textfield" />
            </v-flex>
            <v-flex md3>
              <v-btn class="btn_ui" title="Search tự do">
                Search
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout v-for="(item, i) in searchItems" :key="i" row wrap>
            <v-flex class="search_result_text" md7>
              <span>{{ item.text }}</span>
            </v-flex>
            <v-flex md3>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn color="btn_ui" dark v-on="on">Search</v-btn>
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-list class="no_padding" dense>
      <v-divider />
      <div v-for="(item, i) in menus" :key="i">
        <v-list-group
          v-if="item.childs"
          :prepend-icon="item.icon"
          :group="item.group"
          no-action
          :active-class="
            active.group == item.group ? 'primary_color' : 'no_active_group'
          "
        >
          <v-list-tile slot="activator">
            <v-list-tile-title class="no_select">{{
              $t(item.text)
            }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            v-for="(childItem, j) in item.childs"
            :key="j"
            ripple="ripple"
            :class="[
              active.tab == childItem.name ? 'active_tab primary_color' : ''
            ]"
            @click="goTo(childItem.path)"
          >
            <v-list-tile-title class="no_select">{{
              $t(childItem.text)
            }}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <v-list-tile
          v-else
          ripple="ripple"
          :class="[active.tab == item.name ? 'active_tab primary_color' : '']"
          @click="goTo(item.path)"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="no_select">{{
              $t(item.text)
            }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import ROUTES from 'router/routes';
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    width: {
      type: Number,
      default: 250
    }
  },

  data() {
    return {
      active: {},
      menus: [],
      searchItems: []
    };
  },

  computed: {
    ...mapState('global', ['drawerToggled']),

    drawer: {
      get() {
        return this.drawerToggled;
      },

      set(val) {
        this.toggleDrawer(val);
      }
    }
  },

  watch: {
    $route(to) {
      this.active = {
        tab: to.name,
        group: to.meta.group
      };
    }
  },

  created() {
    this.readListMenuInRoutes();

    this.active = {
      tab: this.$route.name,
      group: this.$route.meta.group
    };
  },

  methods: {
    ...mapActions('global', ['toggleDrawer']),

    goTo(path) {
      this.$router.push({ path: path });
    },

    readListMenuInRoutes() {
      for (let i in ROUTES) {
        let route = ROUTES[i];
        if (route.meta && route.meta.menu) {
          let item = {
            text: route.meta.title,
            icon: route.meta.icon || 'done',
            path: route.path
          };

          if (!route.meta.group) {
            item.name = route.name;
          } else if (route.meta.group && route.meta.super) {
            let childItems = this.readChildrenMenus(route.meta.group);
            if (childItems.length > 0) {
              item.childs = childItems;
              item.group = route.meta.group;
            }
          } else {
            continue;
          }

          this.menus.push(item);
        }
      }
    },

    readChildrenMenus(group) {
      let childItems = [];
      for (let i in ROUTES) {
        let route = ROUTES[i];

        if (route.meta && !route.meta.super && route.meta.group === group) {
          childItems.push({
            text: route.meta.title,
            name: route.name,
            group: route.meta.group,
            path: route.path
          });
        }
      }

      return childItems;
    },

    handleBtnSearchClick() {
      this.searchItems = [
        { text: '0902315272' },
        { text: '0969259299' },
        { text: '0969289369' }
      ];
    }
  }
};
</script>

<style scoped>
.search_textfield {
  padding-top: 0px;
  margin-top: 0px;
}

.search_result_text {
  padding-top: 10px !important;
}

.navigation-drawer {
  top: 56px;
}

.avatar_img {
  border: 2px solid var(--v-primary-base);
}

.active_tab {
  background: #e1e1e1;
}

.active_tab i {
  color: #00695c;
}
</style>
