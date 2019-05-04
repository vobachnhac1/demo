export const PERFECT_TABLE_HOVER_COLOR = {
  COLOR: '#77777',
  BACKGROUND: '#F5F5F5'
};
export const MENU_CONTROLS = {
  SELECT_ROW: () => {
    return {
      code: 'SELECT_ROW',
      icon: 'check_circle',
      text: 'global.table.menu_context.select_row'
    };
  },

  UNSELECT_ROW: () => {
    return {
      code: 'SELECT_ROW',
      icon: 'cancel',
      text: 'global.table.menu_context.unselect_row'
    };
  },

  COPY_INTO_CLIPBORAD: () => {
    return [
      {
        code: 'COPY_CELL',
        icon: 'fa-clipboard',
        text: 'global.table.menu_context.copy_cell'
      },
      {
        code: 'COPY_ROW',
        icon: 'fa-clipboard',
        text: 'global.table.menu_context.copy_row'
      }
    ];
  }
};

export const PERFECT_TABLE_ACTION_SCOPE = {
  GLOBAL: 'global',
  RECORD: 'record',
  CLICK: {
    ROW: 'click.row',
    CELL: 'click.cell'
  }
};

export const PERFECT_TABLE_PAGE_SIZE = [5, 10, 20];

export const PERFECT_TABLE_FILTER_TYPES = [
  'STRING',
  'BOOL',
  'NUMBER',
  'DATE',
  'DATETIME'
];
