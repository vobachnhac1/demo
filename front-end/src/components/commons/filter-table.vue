<template>
  <div id="abc">
    <v-data-table :headers="headers" :items="data_source">
      <template slot="headers" slot-scope="props">
        <tr class="text-uppercase">
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="[
              'column sortable',
              pagination.descending ? 'desc' : 'asc',
              header.value === pagination.sortBy ? 'active' : ''
            ]"
          >
            {{ header.text }}
            <v-icon small>arrow_upward</v-icon>
          </th>
        </tr>
        <tr class="search_header">
          <th v-for="header in props.headers" :key="header.value">
            <v-text-field
              v-if="header.type === 'string' || header.type === 'number'"
              v-model="search_val[header.value].value"
              @input="searchByCol(header.value)"
            />
            <v-checkbox
              v-else-if="header.type === 'bool'"
              v-model="search_val[header.value].value"
              @change="searchByCol(header.value)"
            />
            <v-menu
              v-else-if="header.type === 'date'"
              ref="${date_menu[header.value]}"
              v-model="date_menu[header.value]"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="search_val[header.value].value"
                readonly
              />
              <v-date-picker
                v-model="search_val[header.value].value"
                no-title
                color="#00695c"
                @input="
                  date_menu[header.value] = false;
                  searchByCol(header.value);
                "
              >
                <v-spacer />
                <v-btn
                  flat
                  color="#00695c"
                  @click="
                    date_menu[header.value] = false;
                    search_val[header.value].value = '';
                    searchByCol(header.value);
                  "
                >
                  Clear
                </v-btn>
              </v-date-picker>
            </v-menu>
          </th>
        </tr>
      </template>
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator"> {{ props.header.text }} </span>
          <span> {{ props.header.text }} </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props">
        <slot :item="props.item" name="tbody" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },

    data: {
      type: Array,
      default() {
        return [];
      },
      required: true
    },

    collums: {
      type: Object,
      default() {},
      required: false
    },

    sort: {
      type: String,
      default: '',
      required: false
    }
  },

  data() {
    return {
      date_menu: {},

      search_val: {},

      search_conditions: [],

      pagination: {
        descending: false,
        sortBy: ''
      },

      data_source: []
    };
  },

  watch: {
    sort() {
      this.pagination.sortBy = this.sort;
    },

    data() {
      this.data_source = this.data;
    }
  },

  created() {
    var index;
    for (index = 0; index < this.headers.length; index++) {
      var element = this.headers[index];
      if (
        element.type === 'string' ||
        element.type === 'date' ||
        element.type === 'number'
      ) {
        this.search_val[element.value] = {
          value: '',
          type: element.type
        };
      } else if (element.type === 'bool') {
        this.search_val[element.value] = {
          value: false,
          type: element.type
        };
      }
    }
  },

  mounted() {},

  methods: {
    validData(type, srcVal, destVal) {
      switch (type) {
        case 'bool':
          return srcVal == destVal;
        case 'string':
          return srcVal.toLowerCase().includes(destVal.toLowerCase());
        case 'date':
          return (
            new Date(srcVal).toLocaleDateString() ==
            new Date(destVal).toLocaleDateString()
          );
        case 'number':
          return srcVal == destVal;
      }
      return false;
    },

    isEmpty(search_val) {
      switch (search_val.type) {
        case 'bool':
          return true;
        case 'string':
          return search_val.value === '';
        case 'date':
          return search_val.value === '';
        case 'number':
          return search_val.value == '';
      }
      return false;
    },

    searchByCol(col) {
      if (this.data != undefined && this.data.length > 0) {
        var index = this.search_conditions.indexOf(col);
        if (this.isEmpty(this.search_val[col])) {
          if (index > -1) {
            this.search_conditions.splice(index, 1);
          }
        } else if (index == -1) {
          this.search_conditions.push(col);
        }
        var result = [];

        if (this.search_conditions.length == 0) {
          this.data_source = this.data;
          return;
        }

        for (var i = 0; i < this.data.length; i++) {
          var flag = true;
          var rowData = this.data[i];
          for (var j = 0; j < this.search_conditions.length; j++) {
            var col_name = this.search_conditions[j];
            if (
              !this.validData(
                this.search_val[col_name].type,
                rowData[col_name],
                this.search_val[col_name].value
              )
            ) {
              flag = false;
            }
          }
          if (flag) {
            result.push(this.data[i]);
          }
        }
        this.data_source = result;
      }
    }
  }
};
</script>

<style scoped>
.search_header .v-text-field {
  font-weight: 400;
  font-size: 13px;
}
</style>
