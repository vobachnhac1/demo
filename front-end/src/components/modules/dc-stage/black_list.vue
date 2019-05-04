<template>
  <v-container class="app-wrapper" grid-list-md fluid text-xs-center>
    <v-form>
      <v-layout wrap row>
        <h1>Black List</h1>
      </v-layout>
      <!-- <v-btn color="secondary" @click="confirm">Confirm</v-btn>
      <v-btn color="secondary" @click="default_confirm">YES_NO DEFAULT</v-btn> -->
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      message_text: '',
      type: 'Success'
    };
  },

  methods: {
    ...mapActions({
      success: 'global/showSuccessMsg',
      error: 'global/showErrorMsg',
      warning: 'global/showWarningMsg'
    }),

    show() {
      this[this.type.toLowerCase()](this.message_text);
    },

  //   confirm() {
  //     this.$alert
  //       .warn()
  //       .setMessage('Do you want to exit app?')
  //       .setControls({
  //         yes: 'Yes, I want',
  //         no: {
  //           text: 'No',
  //           color: this.$vuetify.theme.secondary,
  //           style: 'NORMAL',
  //           dark: true
  //         }
  //       })
  //       .setCallback(this.resultConfirm, 'PASS_DATA')
  //       .open();
  //   },

  //   resultConfirm(code, data) {
  //     if (code == 'yes') {
  //       this.$alert
  //         .error()
  //         .setTitle('Confirm')
  //         .setMessage(`Data: ${data}`)
  //         // .setControls({ no: 'No' })
  //         .open();
  //     }
  //   },

  //   default_confirm() {
  //     this.$alert.CONFIRM(choose => {
  //       if (choose) {
  //         alert('Next action');
  //       }
  //     });
  //   }
  }
};
</script>
