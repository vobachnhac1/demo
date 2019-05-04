<template>
  <div :style="loadCustomCss()">
    <div :class="['perfect_table', options.outline ? 'elevation-1' : '']">
      <v-data-table
        :headers="columns"
        :items="data_table"
        :pagination.sync="pagination"
        :sort-icon="$vuetify.icons.SORT"
        hide-actions
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <template v-for="header in ignoreHidden(props.headers)">
              <th v-if="header.value === '$checker'" :key="header.text">
                <v-checkbox
                  v-model="all_check"
                  :ripple="false"
                  height="24"
                  class="checker_col"
                  @change="selectAll"
                />
              </th>

              <v-hover
                v-else-if="enableFilterCol(header.value)"
                :key="header.text"
              >
                <th
                  slot-scope="{ hover }"
                  :class="[
                    'filter column px-2',
                    header.sortable
                      ? pagination.descending
                        ? 'sortable desc'
                        : 'sortable asc'
                      : '',
                    header.value === pagination.sortBy ? 'active' : '',
                    header.align == 'center' ? 'text-xs-center' : 'text-xs-left'
                  ]"
                  :style="{ 'min-width': header.width }"
                  @click="changeSort(header.sortable, header.value)"
                >
                  {{ $t(header.text) }}
                  <v-icon v-if="header.sortable" small>
                    {{ $vuetify.icons.SORT }}
                  </v-icon>
                  <v-expand-transition
                    v-if="
                      filter_options.state &&
                        search_map[header.value] != undefined
                    "
                  >
                    <v-text-field
                      v-show="holdFitlerControl(hover, header.value)"
                      :ref="`filter_${header.value}`"
                      v-model="search_map[header.value].value"
                      :label="header.text"
                      :prefix="`${header.alias}:`"
                      :append-icon="search_map[header.value].operation.icon"
                      solo
                      class="filter_wrapper"
                      @input="filterColumnToResult(header.value)"
                      @click:append="openOperationList(header.value, $event)"
                    />
                  </v-expand-transition>
                </th>
              </v-hover>

              <th v-else :key="header.text">{{ $t(header.text) }}</th>
            </template>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :class="computedDecorateRow(props.item)">
            <td
              v-for="col in ignoreHidden(columns)"
              :key="col.value"
              :style="emptyField(col.value, props.item[col.value])"
              :class="[
                enableFilterCol(col.value) ? 'filter' : '',
                options.decorates.default,
                options.decorates.class[col.value] || '',
                col.value == '$drag_row' ? 'row_handle' : '',
                col.align == 'center' ? 'text-xs-center' : 'text-xs-left'
              ]"
              @contextmenu="handleEvent(props.item, col.value, $event, true)"
              @click="handleEvent(props.item, col.value, $event, false)"
              @mouseenter="hoverHandle($event, false)"
              @mouseleave="hoverHandle($event, true)"
            >
              <template v-if="col.value == '$drag_row'">
                <v-icon small>{{ $vuetify.icons.DRAG }}</v-icon>
              </template>
              <template v-else-if="col.value == '$checker'">
                <check-box
                  :id="props.item[options.key]"
                  :key="props.item[options.key]"
                  :table="table_id"
                  class="checker_col"
                  @change="val => selectRow(val, props.item[options.key], true)"
                />
              </template>
              <template v-else-if="col.editable">
                <slot
                  :record="props.item"
                  :column="col.value"
                  name="editable"
                />
              </template>
              <template v-else-if="col.value == '$actions'">
                <div class="layout justify-center">
                  <div
                    v-for="(action, index) in actions.row"
                    :key="index"
                    :class="[
                      'align-self-center',
                      index < actions.row.length - 1 ? 'mr-2' : ''
                    ]"
                  >
                    <v-btn
                      v-if="action.text != undefined"
                      small
                      outline
                      color="primary"
                      @click="callback(action, props.item, $event)"
                    >
                      <v-icon
                        v-if="action.icon != undefined"
                        small
                        class="mr-2"
                      >
                        {{ action.icon }}
                      </v-icon>
                      {{ action.text }}
                    </v-btn>
                    <v-icon
                      v-else
                      small
                      :color="
                        action.color != undefined ? action.color : 'primary'
                      "
                      @click="callback(action, props.item, $event)"
                    >
                      {{ action.icon }}
                    </v-icon>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ computedCellValue(col.value, props.item[col.value]) }}
              </template>
            </td>
          </tr>
          <template v-if="showEmptyRow(props.index)">
            <template v-for="r in computedEmptyRow">
              <tr :key="r" class="empty-row">
                <td colspan="100" />
              </tr>
            </template>
          </template>
        </template>
        <template slot="no-data">
          <template v-if="options.fixed_row_page">
            <tr v-for="r in pagination.rowsPerPage" :key="r" class="empty-row">
              <td
                v-if="r == Math.floor(pagination.rowsPerPage / 2 + 0.5)"
                colspan="100"
              >
                <v-layout align-center justify-center row fill-height>
                  <div>{{ $t('global.table.message.no_data') }}</div>
                </v-layout>
              </td>
              <td v-else colspan="100" />
            </tr>
          </template>
          <tr v-else>
            <td class="empty-row" colspan="100">
              <v-layout align-center justify-center row fill-height>
                <div>{{ $t('global.table.message.no_data') }}</div>
              </v-layout>
            </td>
          </tr>
        </template>
      </v-data-table>
      <div
        v-if="
          !options.footer_autohidden ||
            (!options.fixed_page || calcTotalPage > 1)
        "
        class="table_footer px-4"
      >
        <template v-if="!options.fixed_page">
          <div
            v-if="filter_options.turn_on"
            class="inline mr-4 filtering_controller"
            @click="changeFilterController"
          >
            <v-icon :color="filter_options.state ? 'primary' : '#b1b1b1'">
              fa-filter
            </v-icon>
          </div>
          <div class="inline mr-4">{{ $t('global.table.page_size') }}</div>
          <div class="inline page_size">
            <v-select
              v-model="pagination.rowsPerPage"
              :items="options.page_size"
            />
          </div>
        </template>
        <div
          v-if="!options.footer_autohidden || calcTotalPage > 1"
          class="pagging"
        >
          <v-pagination
            v-model="pagination.page"
            :length="calcTotalPage"
            :total-visible="5"
          ></v-pagination>
        </div>
      </div>
    </div>
    <v-menu
      v-if="filter_options.turn_on"
      v-model="choose_model.show"
      :position-x="choose_model.x"
      :position-y="choose_model.y"
      transition="slide-y-transition"
      bottom
      left
      absolute
    >
      <v-list class="menu-v-list">
        <v-list-tile
          v-for="(operation, key) in choose_model.operations"
          :key="key"
          avatar
          @click="chooseOperation(choose_model.column, key, $event)"
        >
          <v-list-tile-action>
            <v-icon>{{ operation.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ operation.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu
      v-model="menu_context.show"
      :position-x="menu_context.x"
      :position-y="menu_context.y"
      absolute
      offset-y
    >
      <v-list class="menu-v-list">
        <v-list-tile
          v-for="(item, index) in menu_context.options"
          :key="index"
          @click="menuContextAction(item.code)"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t(item.text) }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import _ from 'lodash';
import TableDragger from 'table-dragger';
import CheckBox from './checkbox';

import { FILTER_ULTIS } from './filter-compare';
import PERFECT_TABLE_FILTER_OPERATIONS from './filter-operations';
import {
  PERFECT_TABLE_HOVER_COLOR,
  MENU_CONTROLS,
  PERFECT_TABLE_ACTION_SCOPE,
  PERFECT_TABLE_PAGE_SIZE,
  PERFECT_TABLE_FILTER_TYPES
} from './table-constants';

export default {
  components: {
    CheckBox
  },

  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },

    headers: {
      type: Object,
      default: () => {
        return {};
      }
    },

    custom: {
      type: Object,
      default: () => {
        return {};
      }
    },

    /**
     * Filter configuration structure
     * {
     *    a: 'STRING',
     *    b: 'string',
     *    c: 'BOOL',
     *    d: 'bool',
     *    e: 'NUMBER',
     *    f: 'number',
     *    g: 'DATE'
     *    h: {
     *      type: 'date',
     *      width: '100px',
     *      alias: '<NAME FOR SHOWN UP>'
     *    }
     * }
     */
    filter: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      table_id: `${new Date().getTime()}`,
      reload: `${new Date().getTime()}`,

      columns: [],

      data_table: [],

      options: {
        key: null,

        sortable: [],
        hiddens: [],
        editables: [],

        autoNo: false,
        checker: false,
        dragable: false,

        outline: true,
        center: [],
        decorates: {
          text: {},
          class: {},
          default: '',
          hover: _.assign(_.cloneDeep(PERFECT_TABLE_HOVER_COLOR), {
            only_cell: false
          })
        },

        fixed_row_page: false,
        fixed_page: false,
        page_size: PERFECT_TABLE_PAGE_SIZE,
        footer_autohidden: false,

        actions: {}
      },

      pagination: {
        rowsPerPage: 5,
        page: 1,
        totalItems: this.value.length
      },

      actions: {
        row: [],
        global: [],
        click: []
      },

      all_check: false,
      map_checkbox: {},

      filter_options: {
        turn_on: false,
        state: false
      },
      search_map: {},
      choose_model: {
        show: false,
        x: 0,
        y: 0,
        column: '',
        current: {},
        operations: []
      },

      menu_context: {
        show: false,
        x: 0,
        y: 0,
        target_col: '',
        target_record: {},
        options: []
      }
    };
  },

  computed: {
    calcTotalPage() {
      let total = _.floor(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
      if (this.pagination.totalItems % this.pagination.rowsPerPage > 0) {
        total++;
      }
      return total;
    },

    computedEmptyRow() {
      let lastRows = this.data_table.length % this.pagination.rowsPerPage;
      return this.pagination.rowsPerPage - lastRows;
    }
  },

  watch: {
    value() {
      this.data_table = _.cloneDeep(this.value);
      this.filtering();
      this.loadCheckbox();
    },

    data_table: {
      handler() {
        this.pagination.totalItems = this.data_table.length;
        for (let i in this.data_table) {
          let row = this.data_table[i];
          row.$no = Number(i) + 1;
          if (_.isNil(row[this.options.key])) {
            throw new TypeError(`Data is not valid [${JSON.stringify(row)}]`);
          }

          let index = _.findIndex(this.value, {
            [this.options.key]: row[this.options.key]
          });
          _.assign(this.value[index], this.removeControlCol(row));
        }
      },
      deep: true
    },

    'filter_options.state': {
      handler() {
        if (this.filter_options.state) {
          this.filtering();
        } else {
          this.data_table = _.cloneDeep(this.value);
        }
      },
      deep: true
    },

    'pagination.rowsPerPage': {
      handler() {
        if (this.calcTotalPage == 0) {
          this.pagination.page = 1;
        } else if (this.pagination.page > this.calcTotalPage) {
          this.pagination.page = this.calcTotalPage;
        }
        this.reloadCheckbox();
      },
      deep: true
    },

    'pagination.page': {
      handler() {
        this.reloadCheckbox();
      },
      deep: true
    }
  },

  created() {
    this.mergeConfigs();
    this.readColumns();
    this.data_table = _.cloneDeep(this.value);
    this.loadCheckbox();
    this.readFilterOptions();
    this.loadActions();
    this.loadPaging();
  },

  updated() {
    this.$nextTick(() => {
      if (this.data_table.length > 0) {
        this.tableDragable();
      }
    });
  },

  methods: {
    mergeConfigs() {
      _.assignIn(this.options.decorates, this.custom.decorates);
      let custom = _.omit(this.custom, 'decorates');
      _.assignIn(this.options, custom);
    },

    readColumns() {
      if (_.isNil(this.options.key)) {
        throw new TypeError('Please provide a valid column name as KEY');
      }

      this.pagination.sortBy = this.options.key;

      if (_.isBoolean(this.options.checker) && this.options.checker) {
        this.columns.push({
          text: 'Checker',
          align: 'center',
          value: '$checker',
          width: '50px'
        });
        this.menu_context.options.push({});
        this.checkPermission();
      }

      this.columns.push({
        text: 'global.table.columns.no',
        align: 'center',
        sortable: true,
        value: '$no',
        width: '50px'
      });

      if (_.isBoolean(this.options.autoNo) && !this.options.autoNo) {
        this.options.hiddens.push('$no');
      }
      if (!_.isEmpty(this.headers)) {
        for (let column in this.headers) {
          if (
            !_.isEmpty(this.options.hiddens) &&
            _.includes(this.options.hiddens, column)
          ) {
            continue;
          }
          let editable = _.includes(this.options.editables, column);
          this.columns.push({
            text: this.headers[column],
            align: this.isTextCenter(column),
            sortable: this.isSortable(column),
            editable,
            value: column,
            width: this.calcWidthColumn(column),
            alias: this.retrieveAlias(column)
          });
        }
      }
    },

    checkPermission() {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state == 'granted' || result.state == 'prompt') {
          this.menu_context.options = _.concat(
            this.menu_context.options,
            MENU_CONTROLS.COPY_INTO_CLIPBORAD()
          );
        }
      });
    },

    loadCheckbox(value) {
      if (_.isBoolean(this.options.checker) && this.options.checker) {
        for (let index in this.value) {
          let el = this.value[index];
          let keyRow = el[this.options.key];

          this.map_checkbox[keyRow] = _.isBoolean(value) ? value : false;
          this.selectRow(this.map_checkbox[keyRow], keyRow, null, true);
        }
      }
    },

    reloadCheckbox() {
      if (!_.isBoolean(this.options.checker) || !this.options.checker) return;
      this.$nextTick(() => {
        this.data_table.forEach(el => {
          let key = el[this.options.key];
          this.$bus.$emit(
            `select_${key}_${this.table_id}`,
            this.map_checkbox[key]
          );
        });
      });
    },

    selectAll(select) {
      if (_.isBoolean(select) && !select) {
        this.all_check = false;
        this.$emit('choosing', []);
      } else {
        this.$emit('choosing', this.collectSelectedRow(true));
      }
      for (let key in this.map_checkbox) {
        this.map_checkbox[key] = this.all_check;
      }
      this.$bus.$emit(`select_all_${this.table_id}`, this.all_check);
    },

    selectRow(val, key, isStop, isIgonre) {
      this.map_checkbox[key] = val;
      this.reload = `${new Date().getTime()}`;
      var isAll = true;
      _.forIn(this.map_checkbox, val => {
        if (!val) {
          isAll = false;
        }
      });
      this.all_check = isAll;
      if (_.isNil(isStop)) {
        this.$bus.$emit(`select_${key}_${this.table_id}`, val);
      }

      if (_.isNil(isIgonre)) {
        this.$emit('choosing', this.collectSelectedRow());
      }
    },

    collectSelectedRow(isAll) {
      if (isAll) {
        if (this.all_check) {
          return _.cloneDeep(this.data_table);
        } else {
          return [];
        }
      } else {
        let result = [];
        for (let key in this.map_checkbox) {
          if (this.map_checkbox[key]) {
            let record = _.find(this.data_table, { [this.options.key]: key });
            result.push(record);
          }
        }
        return result;
      }
    },

    readFilterOptions() {
      if (_.isObject(this.filter) && !_.isEmpty(this.filter)) {
        this.filter_options.turn_on = true;
        let filterCols = _.keys(this.filter).filter(
          key =>
            !_.isNil(this.headers[key]) &&
            !_.includes(this.options.hiddens, key)
        );
        filterCols.forEach(column => {
          let type = this.validFilterTypes(this.filter[column]);
          this.search_map[column] = {
            value: null,
            key: this.options.key,
            type,
            column,
            results: [],
            operation: PERFECT_TABLE_FILTER_OPERATIONS.DEFAULTS[type]
          };
        });
      }
    },

    loadActions() {
      if (_.isBoolean(this.options.dragable) && this.options.dragable) {
        this.columns = _.concat(
          {
            text: '',
            align: 'center',
            sortable: false,
            value: '$drag_row',
            width: '20px'
          },
          this.columns
        );
      }
      if (!_.isNil(this.options.actions) && !_.isEmpty(this.options.actions)) {
        this.columns.push({
          text: 'global.table.columns.action',
          align: 'center',
          sortable: false,
          value: '$actions'
        });

        for (let key in this.options.actions) {
          let action = this.options.actions[key];

          // action.callback = this.handleAction(key, action.callback);
          if (_.isString(action.scope)) {
            switch (action.scope) {
              case PERFECT_TABLE_ACTION_SCOPE.RECORD:
                this.actions.row.push(action);
                break;
              case PERFECT_TABLE_ACTION_SCOPE.GLOBAL:
                this.actions.global.push(action);
                break;
              case PERFECT_TABLE_ACTION_SCOPE.CLICK.ROW:
                this.actions.click.push(action);
                break;
              case PERFECT_TABLE_ACTION_SCOPE.CLICK.CELL:
                if (
                  _.isString(action.target) &&
                  (_.startsWith(action.target, '$') ||
                    _.isNil(this.headers[action.target]))
                ) {
                  break;
                }
                this.actions.click.push(action);
                break;
            }
          }
        }
      }
    },

    callback(action, record, event) {
      event.preventDefault();
      event.stopPropagation();

      record = this.removeControlCol(record);
      action.callback(record[this.options.key], record, event);
    },

    handleEvent(record, col, event, rightClick) {
      let key = record[this.options.key];
      event.preventDefault();
      if (rightClick) {
        this.menu_context.show = false;
        this.menu_context.x = event.clientX;
        this.menu_context.y = event.clientY;
        this.menu_context.target_col = col;
        this.menu_context.target_record = record;

        if (_.isBoolean(this.options.checker) && this.options.checker) {
          let option = MENU_CONTROLS.SELECT_ROW();
          if (this.map_checkbox[key]) {
            option = MENU_CONTROLS.UNSELECT_ROW();
          }
          this.menu_context.options[0] = option;
        }

        this.$nextTick(() => {
          if (this.menu_context.options.length == 0) return;
          this.menu_context.show = true;
        });
      } else {
        let result = { data: _.omit(record, '$no') };
        result[this.options.key] = key;

        for (let index in this.actions.click) {
          let action = this.actions.click[index];
          if (action.scope == PERFECT_TABLE_ACTION_SCOPE.CLICK.CELL) {
            result.target = col;
            result.target_value = record[col];

            if (
              _.startsWith(col, '$') ||
              (!_.isNil(action.target) && action.target !== col)
            ) {
              continue;
            }
          }
          action.callback(result, event);
        }
      }
    },

    menuContextAction(code) {
      let record = this.removeControlCol(this.menu_context.target_record);
      let key = record[this.options.key];
      switch (code) {
        case 'COPY_CELL':
          if (_.startsWith(this.menu_context.target_col, '$')) {
            this.copyToClipBoard(null);
          } else {
            this.copyToClipBoard(record[this.menu_context.target_col]);
          }
          break;
        case 'COPY_ROW':
          this.copyToClipBoard(JSON.stringify(record));
          break;
        case 'SELECT_ROW':
          this.selectRow(!this.map_checkbox[key], key);
          break;
      }
    },

    removeControlCol(record) {
      let needRemove = [];
      for (let key in record) {
        if (_.startsWith(key, '$')) {
          needRemove.push(key);
        }
      }
      return _.omit(record, needRemove);
    },

    copyToClipBoard(data) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state == 'granted' || result.state == 'prompt') {
          if (_.isNil(data)) data = '<NO_DATA>';
          navigator.clipboard.writeText(data);
        }
      });
    },

    tableDragable() {
      if (_.isBoolean(this.options.dragable) && this.options.dragable) {
        var dragger = TableDragger(this.$el.getElementsByTagName('table')[0], {
          mode: 'row',
          dragHandler: '.row_handle',
          onlyBody: true,
          animation: 300
        });
        dragger.on('drop', () => {});
      }
    },

    openOperationList(column, event) {
      event.preventDefault();
      this.focusTextField(`filter_${column}`);

      this.choose_model = {
        show: false,
        column,
        current: this.search_map[column].operation,
        operations:
          PERFECT_TABLE_FILTER_OPERATIONS[this.search_map[column].type]
      };
      this.choose_model.x = event.clientX;
      this.choose_model.y = event.clientY;
      this.$nextTick(() => {
        this.choose_model.show = true;
      });
    },

    chooseOperation(column, choice, event) {
      event.preventDefault();
      this.focusTextField(`filter_${column}`);
      let type = this.search_map[column].type;
      this.search_map[column].operation =
        PERFECT_TABLE_FILTER_OPERATIONS[type][choice];
      this.filterColumnToResult(column);
    },

    filtering() {
      if (!this.filter_options.turn_on) return;

      _.forIn(this.search_map, (value, column) => {
        this.filterColunm(column);
      });
      this.getResult();
    },

    filterColunm(column) {
      let condition = this.search_map[column];
      this.search_map[column].results = [];
      if (!FILTER_ULTIS.ignore[condition.type](condition.value)) {
        this.value.forEach(el => {
          if (!_.isNil(el[column])) {
            FILTER_ULTIS.filter(this.search_map[column], el);
          }
        });
      }
    },

    filterColumnToResult(column) {
      this.filterColunm(column);
      this.getResult();
    },

    changeFilterController() {
      this.filter_options.state = !this.filter_options.state;

      if (this.filter_options.state) {
        this.filtering();
      } else {
        this.cleanFilterCache();
        this.data_table = _.cloneDeep(this.value);
      }
    },

    cleanFilterCache() {
      _.forIn(this.search_map, condition => {
        condition.value = null;
        condition.results = [];
      });
    },

    getResult() {
      let accepts = null;
      _.forIn(this.search_map, filter => {
        if (FILTER_ULTIS.ignore[filter.type](filter.value)) {
          filter.results = [];
        } else {
          if (accepts == null) {
            accepts = filter.results;
            return;
          }

          accepts = _.intersection(accepts, filter.results);
        }
      });
      if (accepts != null) {
        this.data_table = this.value.filter(el =>
          _.includes(accepts, el[this.options.key])
        );
      } else {
        this.data_table = _.cloneDeep(this.value);
      }

      this.selectAll(false);
      this.reloadCheckbox();
    },

    validFilterTypes(colType) {
      if (_.isNil(colType)) return PERFECT_TABLE_FILTER_TYPES[0];
      let ignoreCaseVal = '';
      if (_.isObject(colType)) {
        if (_.isNil(colType.type)) return PERFECT_TABLE_FILTER_TYPES[0];
        else return _.toUpper(colType.type);
      } else {
        ignoreCaseVal = _.toUpper(colType);
      }
      if (PERFECT_TABLE_FILTER_TYPES.includes(ignoreCaseVal)) {
        return ignoreCaseVal;
      } else {
        return PERFECT_TABLE_FILTER_TYPES[0];
      }
    },

    loadCustomCss() {
      let hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
      let options = _.cloneDeep(PERFECT_TABLE_HOVER_COLOR);

      if (_.isNil(this.options.decorates)) {
        this.options.decorates = {
          hover: {
            only_cell: false
          }
        };
      } else if (_.isNil(this.options.decorates.hover)) {
        this.options.decorates.hover = {
          only_cell: false
        };
      } else {
        let custom = _.cloneDeep(this.options.decorates.hover);
        if (_.isString(custom.color) && hexRegex.test(custom.color)) {
          options.COLOR = custom.color;
        }
        if (_.isString(custom.background) && hexRegex.test(custom.background)) {
          options.BACKGROUND = custom.background;
        }
      }

      return {
        '--t-empty-row': PERFECT_TABLE_HOVER_COLOR.BACKGROUND,
        '--t-hover-text': options.COLOR,
        '--t-hover': options.BACKGROUND
      };
    },

    hoverHandle(event, isHover) {
      let el = event.target;

      if (isHover) {
        if (this.options.decorates.hover.only_cell) {
          el.className = el.className.replace(' t-hover', '');
        } else {
          this.hoverRowHandle(el, isHover);
        }
      } else {
        if (this.options.decorates.hover.only_cell) {
          el.className += ' t-hover';
        } else {
          this.hoverRowHandle(el, isHover);
        }
      }
    },

    hoverRowHandle(el, isHover) {
      let childs = Array.from(el.parentNode.children);
      for (let index in childs) {
        if (isHover) {
          childs[index].className = childs[index].className.replace(
            ' t-hover',
            ''
          );
        } else {
          childs[index].className += ' t-hover';
        }
      }
    },

    focusTextField(control) {
      let component = this.$refs[control];
      if (component != undefined && component[0] != undefined) {
        let inputControl = component[0].$el.getElementsByTagName('input');
        inputControl[0].focus();
      }
    },

    ignoreHidden(headers) {
      return headers.filter(
        col =>
          _.isEmpty(this.options.hiddens) ||
          !_.includes(this.options.hiddens, col.value)
      );
    },

    isSortable(col) {
      return (
        _.isArray(this.options.sortable) &&
        _.includes(this.options.sortable, col)
      );
    },

    isTextCenter(col) {
      return _.isArray(this.options.center) &&
        _.includes(this.options.center, col)
        ? 'center'
        : 'left';
    },

    calcWidthColumn(col) {
      if (
        !_.isNil(this.filter[col]) &&
        _.isObject(this.filter[col]) &&
        !_.isNil(this.filter[col].width)
      ) {
        return this.filter[col].width;
      } else {
        return '100px';
      }
    },

    retrieveAlias(col) {
      if (
        _.isNil(this.filter) ||
        _.isNil(this.filter[col]) ||
        _.isNil(this.filter[col].alias)
      )
        return this.headers[col];

      return this.filter[col].alias;
    },

    enableFilterCol(col) {
      if (_.isNil(this.filter) || _.isNil(this.filter[col])) return false;

      return true;
    },

    computedDecorateRow(record) {
      this.reload ? true : false;

      let key = record[this.options.key];
      var result = [];
      if (_.isBoolean(this.options.checker) && this.options.checker) {
        if (this.map_checkbox[key]) {
          result.push('t-hover');
        }
      }

      if (
        _.isNil(this.options.decorates.row) ||
        !_.isArray(this.options.decorates.row)
      ) {
        return result;
      }

      this.options.decorates.row.forEach(el => {
        if (_.isFunction(el.condition) && el.condition(record)) {
          result.push(el.class);
        }
      });
      return result;
    },

    showEmptyRow(index) {
      index++;
      return (
        this.options.fixed_row_page &&
        this.pagination.page == this.calcTotalPage &&
        index == this.pagination.totalItems % this.pagination.rowsPerPage
      );
    },

    holdFitlerControl(hover, column) {
      let component = this.$refs[`filter_${column}`];
      let isFocus = false;
      if (component != undefined && component[0] != undefined) {
        isFocus = component[0].isFocused;
      }
      let val = this.search_map[column].value;
      if (val == '') {
        this.search_map[column].value = null;
      }

      return hover || isFocus || this.search_map[column].value != null;
    },

    changeSort(sortable, column) {
      if (this.filter_options.state && !_.isNil(this.search_map[column]))
        return;

      if (!sortable) return;
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
      this.reloadCheckbox();
    },

    computedCellValue(col, val) {
      if (
        _.isNil(this.options.decorates) ||
        _.isNil(this.options.decorates.text) ||
        _.isNil(this.options.decorates.text[col])
      ) {
        return val;
      }
      return this.options.decorates.text[col](val);
    },

    emptyField(col, val) {
      if (!_.startsWith(col, '$') && _.isNil(val)) {
        return {
          background: '#fff5f5'
        };
      }
      return {};
    },

    loadPaging() {
      let headers = this.columns.filter(
        col =>
          _.isEmpty(this.options.hiddens) ||
          !_.includes(this.options.hiddens, col.value)
      );

      if (_.isArray(this.options.page_size)) {
        if (this.options.page_size.length == 0) {
          this.options.page_size = PERFECT_TABLE_PAGE_SIZE;
        } else if (this.options.page_size.length == 1) {
          this.options.fixed_page = true;
        }
      } else {
        this.options.page_size = PERFECT_TABLE_PAGE_SIZE;
      }

      this.pagination.rowsPerPage = this.options.page_size[0];

      this.pagination.descending = false;
      this.pagination.sortBy = this.options.key;
      if (
        !_.isEmpty(this.options.hiddens) &&
        _.includes(this.options.hiddens, this.options.key)
      ) {
        if (_.isBoolean(this.options.autoNo) && this.options.autoNo) {
          this.pagination.sortBy = '$no';
        } else if (
          _.isBoolean(this.options.dragable) &&
          this.options.dragable
        ) {
          this.pagination.sortBy = headers.length > 1 ? headers[1].value : '';
        } else {
          this.pagination.sortBy = headers[0].value;
        }
      }

      return headers;
    }
  }
};
</script>

<style>
.perfect_table {
  overflow: hidden;
}

.perfect_table .v-datatable thead tr {
  background-color: #e1e1e1;
}

.perfect_table .v-datatable thead tr th.filter,
.perfect_table .v-datatable tbody tr td.filter {
  padding: 0 !important;
}

.perfect_table .v-datatable thead tr:first-child {
  border-bottom: 2px solid var(--v-primary-base) !important;
}

.perfect_table .v-datatable thead tr th {
  color: var(--v-primary-lighten1);
  font-size: 13px;
  font-weight: 600;
}

.perfect_table .v-datatable thead th:hover,
.perfect_table .v-datatable thead th.sortable:hover {
  color: var(--v-primary-base);
}

.perfect_table .theme--light.v-table tbody tr:hover {
  background-color: #00000000;
}

.perfect_table .v-datatable tbody tr.t-hover,
.perfect_table .v-datatable tbody tr td.t-hover {
  color: var(--t-hover-text) !important;
  background-color: var(--t-hover) !important;
}

.perfect_table .v-datatable td:not(:last-child) {
  border-right: 1px solid #0000001f !important;
}

.perfect_table .v-datatable thead th.sortable.active i,
.perfect_table .v-datatable thead th.sortable.active {
  color: var(--v-primary-base) !important;
}

.perfect_table .v-datatable .checker_col {
  height: 24px;
  justify-content: center;
}

.perfect_table .v-datatable .checker_col .v-input--selection-controls__input {
  margin: 0;
}

.perfect_table .table_footer {
  width: 100%;
  height: 52px;
  line-height: 52px;
  border-top: 1px solid #0000001f;
  background-color: white;
  font-size: 12px;
  font-weight: 600;
  color: #0000008a;
  position: relative;
  display: flex;
}

.perfect_table .table_footer .pagging {
  position: absolute;
  right: 16px;
  top: 0;
  height: 52px;
  padding: 5px 0;
}

.perfect_table .table_footer .pagging .v-pagination__item {
  line-height: 34px;
}

.perfect_table .page_size {
  display: flex;
}

.perfect_table .table_footer .filtering_controller {
  cursor: pointer;
  user-select: none;
  font-size: 16px;
}

.perfect_table .page_size .v-select {
  padding: 0;
  margin: 0;
  max-width: 70px;
  align-self: center;
}

.perfect_table .table_footer .v-input__slot {
  margin: 0;
}

.perfect_table .table_footer .v-text-field__details {
  display: none;
}

.perfect_table .table_footer .v-select__selection {
  font-size: 12px;
}

.perfect_table .empty-row {
  border: 0 !important;
}

.perfect_table .empty-row td {
  background-color: var(--t-empty-row);
}

.perfect_table .filter {
  position: relative;
}

.perfect_table .filter .filter_wrapper {
  bottom: 4px;
  left: 0;
  position: absolute;
  font-size: 500;
}

.perfect_table .filter .filter_wrapper .v-input__slot input,
.perfect_table .filter .filter_wrapper .v-input__slot label {
  font-weight: 400;
  font-size: 15px;
}

.perfect_table .filter .filter_wrapper .v-input__slot {
  margin: 0;
}

.perfect_table .filter .filter_wrapper .v-text-field__details {
  display: none;
}

.perfect_table .filter .filter_wrapper .v-icon {
  font-size: 16px;
  opacity: 0.9 !important;
}

.menu-v-list {
  max-height: 240px;
  overflow-y: overlay;
  padding: 0 !important;
}

.menu-v-list .v-list__tile {
  height: 40px;
  padding-left: 0 !important;
}

.menu-v-list .v-list__tile:hover .v-icon,
.menu-v-list .v-list__tile:hover .v-list__tile__title {
  color: var(--v-warning-base) !important;
}

.menu-v-list .v-list__tile__action {
  min-width: unset;
  justify-content: center;
  width: 40px;
}

.menu-v-list .v-icon {
  font-size: 16px !important;
}

.menu-v-list .v-list__tile__title {
  font-size: 13px !important;
}
</style>
