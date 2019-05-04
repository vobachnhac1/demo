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
    loading: 'Đang tải ...',

    inactivate: {
      message: 'Bạn sẽ bị đăng suất sau <strong>%{0}</strong> giây'
    },

    alert: {
      title: 'Thông báo'
    },

    btns: {
      continute: 'Tiếp tục'
    },

    table: {
      columns: {
        no: 'STT',
        action: 'Điều khiển'
      },
      page_size: 'Số dòng:',
      message: {
        no_data: 'NO DATA'
      },
      filter: {
        start_with: 'Bắt đầu bằng',
        not_start_with: 'Không bắt đầu bằng',
        end_with: 'Kết thúc bằng',
        not_end_with: 'Không kết thúc bằng',
        includes: 'Chứa',
        not_includes: 'Không chứa',

        equals: 'Bằng',
        not_equals: 'Không bằng',
        less_than: 'Nhỏ hơn',
        less_than_equal: 'Nhở hơn hoặc bằng',
        greater_than: 'Lớn hơn',
        greater_than_equal: 'Lớn hơn hoặc bằng'
      },
      menu_context: {
        copy_cell: 'Chép giá trị của Ô',
        copy_row: 'Chép giá trị của DÒNG'
      }
    },

    validation: {
      require: '%{0} là bắt buộc',
      min_length: '%{0} phải nhập ít nhất %{1} ký tự',
      max_length: '%{0} tối đa chỉ %{1} ký tự'
    }
  },

  http_client: {
    errors: {
      '000': 'Không thể kết nối tới server',
      '1xx': 'Yêu cầu đang được xử lý',
      '2xx': 'Yêu cầu thành công',
      '3xx': 'Yêu cầu bị chuyển hướng',
      '4xx': 'Lỗi không xác định từ trình duyệt',
      '5xx': 'Lỗi không xác định từ server',

      304: 'Server không cho phép truy cập khác domain',
      401: 'Bạn không có quyền trên API này',
      403: 'Bạn cần đăng nhập trước khi gửi yêu cầu tới server',
      404: 'Đường dẫn bạn truy cập không tồn tại',
      415: 'Server không hổ trợ phương thức bạn gửi cho URI',
      500: 'Có lỗi xảy ra trên yêu cầu này. Vui lòng liên hệ Admin'
    }
  },

  error_page: {
    401: 'OOPS! Bạn không có quyền truy cập trên trang',
    403: 'Vui lòng đăng nhặp lại trước khi sử dụng',
    404: 'OOPS! Không thể tìm thấy đường dẫn vừa rồi trên hệ thống',
    500: 'Xin lỗi! Chúng tôi đang gặp vấn đề'
  },

  login_page
};
