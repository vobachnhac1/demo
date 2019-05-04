<template>
  <v-container class="app-wrapper" grid-list-md fluid text-xs-center>
    <v-form ref="formSearch">
      <v-layout row wrap class="block">
        <v-flex xs12>
          <v-card class="delimiter_row_bottom">
            <v-card-title class="title font-italic">
              Data Checker - Check List
            </v-card-title>
          </v-card>
          <v-card>
            <v-card-text>
              <v-layout row wrap class="layout_row">
                <v-flex md4 style="text-align:left;">
                  <v-btn class="btn_ui">
                    Clear
                  </v-btn>
                  <v-btn class="btn_ui">
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-text>
              <v-tabs color="transparent" grow fixed-tabs>
                <v-tab key="1">Check List</v-tab>
                <v-tab key="2">App Information</v-tab>
                <!-- (S) Tab Check List -->
                <v-tab-item key="1">
                  <v-card>
                    <v-card-text>
                      <div class="block wrap row">
                        <v-layout row wrap class="layout_row">
                          <v-flex md5>
                            <v-radio-group row>
                              <v-chip label class="v-chip-style">
                                ID CARD
                              </v-chip>
                              <v-radio label="OK" value="radio-1"></v-radio>
                              <v-radio label="NOT OK" value="radio-2"></v-radio>
                              <v-radio
                                label="WARNING"
                                value="radio-3"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                          <v-flex md7>
                            <v-text-field
                              placeholder="Your comment please..."
                            />
                          </v-flex>
                        </v-layout>
                      </div>
                      <div class="block wrap row">
                        <v-layout row wrap class="layout_row">
                          <v-flex md5>
                            <v-radio-group row>
                              <v-chip label class="v-chip-style">
                                FAMILY BOOK
                              </v-chip>
                              <v-radio label="OK" value="radio-1"></v-radio>
                              <v-radio label="NOT OK" value="radio-2"></v-radio>
                              <v-radio
                                label="WARNING"
                                value="radio-3"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                          <v-flex md7>
                            <v-text-field
                              placeholder="Your comment please..."
                            />
                          </v-flex>
                        </v-layout>
                      </div>
                      <div id="work_proof" class="block wrap row">
                        <v-layout row wrap class="layout_row">
                          <v-flex md5>
                            <v-radio-group row>
                              <v-chip
                                label
                                class="v-chip-style-custom"
                                @click="hanleExpandDetail"
                                @dblclick="hanleNotExpandDetail"
                              >
                                WORK PROOF
                                <v-icon color="primary">
                                  $vuetify.icons.expand
                                </v-icon>
                              </v-chip>
                              <v-radio label="OK" value="radio-1"></v-radio>
                              <v-radio label="NOT OK" value="radio-2"></v-radio>
                              <v-radio
                                label="WARNING"
                                value="radio-3"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                          <v-flex md2>
                            <v-select 
                              v-model="workProof.selected"
                              :items="workProof.items"
                            />
                          </v-flex>
                          <v-flex md5>
                            <v-text-field
                              placeholder="Your comment please..."
                            />
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap class="layout_row_expand" />
                        <v-layout row wrap>
                          <v-flex md12>
                            <v-expansion-panel
                              v-model="control_expand_panel.panel0"
                              expand
                            >
                              <v-expansion-panel-content>
                                <!-- <template v-slot:actions>
                                  <v-icon color="primary">$vuetify.icons.expand</v-icon>
                                </template>
                                <template v-slot:header>
                                  <div></div>
                                </template> -->
                                <v-card>
                                  <v-card-text class="grey lighten-3">
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md5>
                                        <v-text-field label="F1 Tax Code" />
                                      </v-flex>
                                      <v-flex md5>
                                        <v-text-field label="F1 Company Name" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md5>
                                        <v-text-field label="Tax Code" />
                                      </v-flex>
                                      <v-flex md5>
                                        <v-text-field label="Company Name" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md10>
                                        <v-text-field label="Risk Note" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md8>
                                        <v-text-field label="DC Note" />
                                      </v-flex>
                                      <v-flex md2>
                                        <v-btn class="btn_ui">
                                          Create/Update
                                        </v-btn>
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md10>
                                        <v-text-field label="PHV Note" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md10>
                                        <v-text-field label="UND Note" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                    <v-layout
                                      row
                                      wrap
                                      class="layout_row_expand_detail"
                                    >
                                      <v-flex md1 />
                                      <v-flex md10>
                                        <v-text-field label="Sup/TL Confirm" />
                                      </v-flex>
                                      <v-flex md1 />
                                    </v-layout>
                                  </v-card-text>
                                </v-card>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-flex>
                        </v-layout>
                      </div>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">
                              INCOME PROOF
                            </v-chip>
                            <v-radio label="OK" value="radio-1"></v-radio>
                            <v-radio label="NOT OK" value="radio-2"></v-radio>
                            <v-radio label="WARNING" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md2>
                          <v-select
                            v-model="inComeProof.selected"
                            :items="inComeProof.items"
                          />
                        </v-flex>
                        <v-flex md5>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">
                              CURRENT ADDRESS
                            </v-chip>
                            <v-radio label="OK" value="radio-1"></v-radio>
                            <v-radio label="NOT OK" value="radio-2"></v-radio>
                            <v-radio label="WARNING" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md2>
                          <v-select
                            v-model="currentAddress.selected"
                            :items="currentAddress.items"
                          />
                        </v-flex>
                        <v-flex md5>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">CIB</v-chip>
                            <v-radio label="OK" value="radio-1"></v-radio>
                            <v-radio label="NOT OK" value="radio-2"></v-radio>
                            <v-radio label="WARNING" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md2>
                          <v-select
                            v-model="cibTaxDupe.selected"
                            :items="cibTaxDupe.items"
                          />
                        </v-flex>
                        <v-flex md2>
                          <v-select />
                        </v-flex>
                        <v-flex md3>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">TAX</v-chip>
                            <v-radio label="OK" value="radio-1"></v-radio>
                            <v-radio label="NOT OK" value="radio-2"></v-radio>
                            <v-radio label="WARNING" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md2>
                          <v-select
                            v-model="cibTaxDupe.selected"
                            :items="cibTaxDupe.items"
                          />
                        </v-flex>
                        <v-flex md2>
                          <v-select />
                        </v-flex>
                        <v-flex md3>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">DUPE</v-chip>
                            <v-radio label="OK" value="radio-1"></v-radio>
                            <v-radio label="NOT OK" value="radio-2"></v-radio>
                            <v-radio label="WARNING" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md2>
                          <v-select
                            v-model="cibTaxDupe.selected"
                            :items="cibTaxDupe.items"
                          />
                        </v-flex>
                        <v-flex md5>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row">
                        <v-flex md5>
                          <v-radio-group row>
                            <v-chip label class="v-chip-style">STATUS</v-chip>
                            <v-radio label="DEFER" value="radio-1"></v-radio>
                            <v-radio label="PENDING" value="radio-2"></v-radio>
                            <v-radio label="FINISH" value="radio-3"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex md>
                          <v-text-field placeholder="Your comment please..." />
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap class="layout_row_table" />
                      <cd-perfect-table
                        v-model="tableDataCheckList"
                        :headers="headersCheckList"
                        :custom="optionsCheckList"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- (E) Tab Check List -->

                <!-- (S) Tab App Information -->
                <v-tab-item key="2">
                  <v-card>
                    <v-card-text>
                      <cd-perfect-table
                        v-model="tableDataAppInfor"
                        :headers="headersAppInfor"
                        :custom="optionsAppInfor"
                      />
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <!-- (E) Tab App Information -->
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      workProof:{
        items: [
          {
            text: '...',
            value: null
          },
          {
            text: 'GXN công tác',
            value: 0
          },
          {
            text: 'HĐLĐ',
            value: 1
          },
          {
            text: 'QĐ của công ty/nhà nước',
            value: 2
          },
          {
            text: 'HĐTD tại TCTD khác',
            value: 3
          },
          {
            text: 'GPĐKKD',
            value: 4
          }
        ],
        selected: null
      },

      inComeProof:{
        items: [
          {
            text: '...',
            value: null
          },
          {
            text: 'SKNH',
            value: 0
          },
          {
            text: 'HĐLĐ',
            value: 1
          },
          {
            text: 'Bảng lương cá nhân',
            value: 2
          },
          {
            text: 'Bảng lương tập thể',
            value: 3
          },
          {
            text: 'GXN lương',
            value: 4
          },
          {
            text: 'Hóa đơn thanh toán khoản vay',
            value: 5
          },
          {
            text: 'Biên lai nộp thuế',
            value: 6
          }
        ],
        selected: null
      },

      currentAddress:{
        items: [
          {
            text: '...',
            value: null
          },
          {
            text: 'Sổ tạm trú/lưu trú',
            value: 0
          },
          {
            text: 'Thẻ tạm trú',
            value: 1
          },
          {
            text: 'GXN Tạm trú/lưu trú',
            value: 2
          },
          {
            text: 'Thông báo tạm trú/lưu trú',
            value: 3
          },
          {
            text: 'Hóa đơn điện/nước',
            value: 4
          },
          {
            text: 'BHYT',
            value: 5
          }
        ],
        selected: null
      },

      cibTaxDupe:{
        items: [
          {
            text: '...',
            value: null
          },
          {
            text: 'Customer',
            value: 0
          },
          {
            text: 'Spouse',
            value: 1
          },
          {
            text: 'Self',
            value: 2
          }
        ],
        selected: null
      },

      tableDataCheckList: [],
      tableDataAppInfor: [],
      headersCheckList: {
        paper_type: 'Loại Giấy Tờ',
        detail: 'Chi Tiết',
        result: 'Kết Quả',
        code: 'Code',
        note: 'Ghi Chú',
        user: 'User',
        create_date: 'Ngày Tạo'
      },

      headersAppInfor: {
        paper_type: 'Loại Giấy Tờ',
        detail: 'Chi Tiết',
        result: 'Kết Quả',
        code: 'Code',
        note: 'Ghi Chú',
        user: 'User',
        create_date: 'Ngày Tạo'
      },

      optionsCheckList: {
        key: 'id',
        fixed_row_page: true,
        page_size: [5],
        center: ['user'],
        actions: {},
        decorates: {
          text: {},
          default: 'full_text_table',
          class: {
            create_date: 'text_right'
          }
        }
      },

      optionsAppInfor: {
        key: 'id',
        fixed_row_page: true,
        page_size: [10],
        center: ['user'],
        actions: {},
        decorates: {
          text: {},
          default: 'full_text_table',
          class: {
            create_date: 'text_right'
          }
        }
      },

      control_expand_panel: {
        panel0: [false]
      }
    };
  },

  methods: {
    ...mapActions({}),

    hanleExpandDetail() {
      this.control_expand_panel.panel0 = [true];
    },

    hanleNotExpandDetail() {
      this.control_expand_panel.panel0 = [false];
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding-top: 0px;
  margin-bottom: 0px !important;
  margin-top: 0px;
}

.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}

.v-chip-style-custom {
  color: #007bff;
  width: 140.45px;
  font-weight: bold;
}

.v-chip-style {
  width: 140.45px;
}

.full_text_table {
  white-space: nowrap;
}

.text_left {
  text-align: left !important;
}

.text_center {
  text-align: center !important;
}

.text_right {
  text-align: right !important;
}

.layout_row_expand_detail {
  height: 50px !important;
}

.layout_row {
  height: 35px !important;
}

.layout_row_expand {
  height: 5px !important;
}

.v-tabs__div {
  text-transform: none;
}

.layout_row_table {
  height: 15px !important;
}

.app-wrapper .block {
  padding-bottom: 8px !important;
}
</style>
