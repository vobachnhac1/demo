<template>
  <v-app class="dark">
    <v-content>
      <v-container
        class="bg_color"
        fluid
        fill-height
        justify-center
        grid-list-md
      >
        <v-card width="700" class="wrapper_content">
          <v-card-text class="no_padding">
            <v-layout row fill-height wrap>
              <v-flex md3 class="content_nav">
                <div>
                  <div
                    :class="{
                      child: true,
                      headline: true,
                      active: tab_login == 1
                    }"
                    @click="tab_login = 1"
                  >
                    login
                  </div>
                  <div
                    :class="{
                      child: true,
                      headline: true,
                      active: tab_login == 2
                    }"
                    @click="tab_login = 2"
                  >
                    register
                  </div>
                </div>
              </v-flex>
              <v-flex md9 class="content_form">
                <v-layout row fill-height wrap>
                  <v-flex
                    md10
                    offset-md1
                    :style="{ color: $vuetify.theme.primary }"
                    class="headline welcome"
                  >
                    Welcome to Document Management Tool
                  </v-flex>
                  <v-flex md10 offset-md1 class="no_padding">
                    <v-text-field
                      ref="username"
                      v-model="username"
                      label="Username"
                      :rules="rules.username"
                      browser-autocomplete="off"
                      autofocus
                      @keypress.enter="loginForm"
                    />
                  </v-flex>
                  <v-flex md10 offset-md1 class="no_padding">
                    <v-text-field
                      ref="password"
                      v-model="password"
                      type="password"
                      label="Password"
                      :rules="rules.password"
                      browser-autocomplete="off"
                      @keypress.enter="loginForm"
                    />
                  </v-flex>
                  <v-flex md10 offset-md1 class="no_padding">
                    <v-layout
                      justify-space-between
                      align-center
                      row
                      fill-height
                    >
                      <v-flex>
                        <v-checkbox
                          v-model="remember_me"
                          :color="$vuetify.theme.primary"
                        >
                          <template slot="label">
                            <div
                              :style="remember_me ? { 'font-weight': 500 } : {}"
                            >
                              Remember me
                            </div>
                          </template>
                        </v-checkbox>
                      </v-flex>
                      <v-flex style="text-align:right">
                        <v-btn
                          class="no_margin_hori"
                          outline
                          :color="$vuetify.theme.primary"
                          @click="loginForm"
                        >
                          <v-icon left>{{ $vuetify.icons.BTN_LOGIN }}</v-icon>
                          login
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex md10 offset-md1 class="no_padding last_row">
                    <v-btn
                      small
                      flat
                      :color="$vuetify.theme.primary"
                      class="no_margin"
                      @click="forgotPassword"
                    >
                      forgot password
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text :class="['waiting', waiting ? 'show' : '']">
            <v-layout align-center justify-center fill-height>
              <v-progress-circular
                v-if="login_response == ''"
                indeterminate
                :size="100"
                color="primary"
              ></v-progress-circular>
              <template v-else>
                <v-layout row wrap>
                  <v-flex md12 class="text-md-center login_response title">
                    {{ login_response }}
                  </v-flex>
                  <v-flex md12 class="text-md-center">
                    <v-btn color="primary" outline @click="reLogin">
                      <v-icon left> {{ $vuetify.icons.RELOAD }} </v-icon>
                      retry
                    </v-btn>
                  </v-flex>
                </v-layout>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import { Checker } from 'utilities';

export default {
  data() {
    return {
      username: '',
      password: '',
      remember_me: false,

      tab_login: 1,

      waiting: false,
      login_response: '',

      rules: {
        username: [
          v => !!v || 'Username is required',
          v => v.length >= 4 || 'Username must be at least 5 characters'
        ],
        password: [v => !!v || 'Password is required']
      }
    };
  },

  created() {
    this.wait(1000);
  },

  methods: {
    ...mapActions('authentication', ['login']),

    wait(timeout = 0) {
      var _self = this;
      _self.waiting = true;
      if (timeout > 0) {
        setTimeout(() => {
          _self.waiting = false;
        }, timeout);
      }
    },

    loginForm() {
      if (
        Checker.hasText(this.username) &&
        this.username.length >= 4 &&
        Checker.hasText(this.password)
      ) {
        this.wait();

        var _self = this;
        setTimeout(async () => {
          let response = await _self.login({
            username: _self.username,
            password: _self.password,
            remember_me: _self.remember_me
          });
          if (Checker.hasText(response)) {
            _self.login_response = response;
          }
        }, 1000);
      } else {
        Checker.emptyString(this.username) || this.username.length < 5
          ? this.$refs.username.focus()
          : this.$refs.password.focus();
      }
    },

    reLogin() {
      this.password = '';
      this.remember_me = false;
      this.waiting = false;
      this.login_response = '';
      this.$refs.password.focus();
    },

    forgotPassword() {}
  }
};
</script>

<style scoped>
.bg_color {
  background-color: #e5e5e5;
}

.wrapper_content {
  position: relative;
}

.welcome {
  padding: 50px 0 10px !important;
}

.content_nav > div {
  height: 100%;
  padding: 30px 0 0;
  background-color: #f1f1f1;
  position: relative;
}

.content_nav .child {
  text-align: right;
  padding: 15px !important;
  color: #888;
  cursor: pointer;
}

.content_nav .child.active {
  color: #00695c;
  background-color: #e1e1e1;
}

.last_row {
  border-top: 1px solid #ccc;
  padding: 15px 0 20px !important;
}

.waiting {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: white;
  transform: scale(0.5, 0.5);

  transition: all 0.2s ease-out;
}

.waiting.show {
  opacity: 1;
  transform: scale(1, 1);
  z-index: 1000;
}

.login_response {
  line-height: 50px !important;
  color: var(--v-error-base);
}
</style>
