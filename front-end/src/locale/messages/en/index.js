import login_page from './login';

export default {
  menu: {
    dashboard: 'Dashboard',
    defer_rule: {
      parent: 'Defer Rule',
      group: 'Group Management',
      detail: 'Detail Defer Management'
    },
    parameter_deadline: 'Deadline Parameter',
    staff_information: {
      parent: 'Staff Information',
      area: 'Area Manager'
    },
    tracking_info: 'Tracking Information',
    import_document: 'Import Document',
    distribute: 'Distribute',
    retrieval: 'Retrieval',
    bpo_check_doc: 'BPO check Document',
    tat_tracking: 'TAT Tracking'
  },

  global: {
    loading: 'Loading ...',

    alert: {
      title: 'Alert',
      default_confirm: {
        title: 'Confirmation',
        message: 'Do you want to continue?',
        yes_btn: 'Continue',
        no_btn: 'No'
      }
    },

    btns: {
      continute: 'Continute'
    },

    table: {
      columns: {
        no: 'No.',
        action: 'Actions'
      },
      page_size: 'Rows: ',
      message: {
        no_data: 'NO DATA'
      },
      filter: {
        start_with: 'Start with',
        not_start_with: 'Not start with',
        end_with: 'End with',
        not_end_with: 'Not end with',
        includes: 'Includes',
        not_includes: 'Not includes',

        equals: 'Equals',
        not_equals: 'Not equals',
        less_than: 'Less than',
        less_than_equal: 'Less than or equals',
        greater_than: 'Greater than',
        greater_than_equal: 'Greater than or equals'
      },
      menu_context: {
        copy_cell: 'Copy selected CELL',
        copy_row: 'Copy selected ROW',
        select_row: 'Select row',
        unselect_row: 'Remove select row'
      }
    },

    validation: {
      require: '%{0} is required',
      min_length: '%{0} must be at least %{1} characters',
      max_length: '%{0} can contain up to %{1} characters'
    }
  },

  http_client: {
    errors: {
      '000': 'Can not connect to Server API',
      '1xx': 'Continuing process',
      '2xx': 'Request success',
      '3xx': 'Request redirection',
      '4xx': 'Unknown client error',
      '5xx': 'Unknown server error',

      304: 'Server API do not accept CORS from this address',
      401: 'You do not have permision on API',
      403: 'Must be authenticate befor accessing this API',
      404: 'The request URL do not exist on server API',
      415: 'Server not support that method for URL',
      500: 'Has an error for this request. Refer admin to resolve'
    }
  },

  error_page: {
    401: 'OOPS! You don have permission on that page',
    403: 'Please re-login before comeback application',
    404: 'OOPS! Sorry we can not find that URL',
    500: 'Sorry something went wrong'
  },

  login_page
};
