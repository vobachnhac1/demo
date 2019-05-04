<template>
  <v-app class="dark">
    <v-content>
      <v-container class="bg_color" fluid fill-height>
        <v-layout align-center justify-center column class="error_content">
          <v-flex md12 class="error_code font-weight-light">{{
            information.code
          }}</v-flex>
          <v-flex md12 class="error_message">{{ information.message }}</v-flex>
          <v-flex md12 class="error_btn">
            <v-btn
              outline
              :color="information.btn_color"
              @click="goTo(information.redirect)"
            >
              <v-icon left>{{ information.btn_icon }}</v-icon>
              {{ information.btn_text }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      error_map: {
        401: {
          code: 401,
          message: 'Must be authenticate befor accessing this API',
          btn_icon: this.$vuetify.icons.HOME,
          btn_text: 'GO HOME',
          btn_color: '#00695c',
          redirect: '/'
        },
        403: {
          code: 403,
          message: 'You do not have permision on API',
          btn_icon: this.$vuetify.icons.LOGIN,
          btn_text: 'LOGIN',
          btn_color: 'blue-grey',
          redirect: '/login'
        },
        404: {
          code: 404,
          message: 'The request URL do not exist on server API',
          btn_icon: this.$vuetify.icons.HOME,
          btn_text: 'GO HOME',
          btn_color: '#00695c',
          redirect: '/'
        },
        406: {
          code: 406,
          message: 'This request is not acceptable',
          btn_icon: this.$vuetify.icons.HOME,
          btn_text: 'GO HOME',
          btn_color: '#00695c',
          redirect: '/'
        },
        500: {
          code: 500,
          message: 'Has an error for this request. Refer admin to resolve',
          btn_icon: this.$vuetify.icons.HOME,
          btn_text: 'GO HOME',
          btn_color: '#00695c',
          redirect: '/'
        }
      },

      information: {}
    };
  },

  created() {
    this.information = this.error_map[this.$route.meta.code];
  },

  methods: {
    goTo(path) {
      this.$router.push({ path });
    }
  }
};
</script>

<style scoped>
.error_code {
  max-height: 150px;
  line-height: 150px;
  font-size: 150px;
  text-align: center;
  margin-bottom: 20px;
}

.error_message {
  text-transform: uppercase;
  font-size: 25px;
  max-height: 30px;
  text-align: center;
  color: #999;
}

.bg_color {
  background-color: #e5e5e5;
}

.error_content {
  max-height: 450px;
}

.error_btn {
  margin-top: 15px;
  padding: 10px 40px 0;
  border-top: 1px solid #999;
}
</style>
