import download from 'downloadjs';
import _ from 'lodash';

const SUPPORTED_DATA_TYPES = ['String', 'Number'];

export default class Exporter {
  constructor(filename) {
    this.name = filename + '.xls';
    this.sheets = [];
  }

  setFilename(filename) {
    this.name = filename + '.xls';
  }

  setConfigurations({
    REPLACE_UNKNOWN_TO_EMPTY = false,
    DECORATE_BORDER = false,
    DECORATE_HEADER_COLOR = '#888888'
  }) {
    this.custom = {
      isReplace: REPLACE_UNKNOWN_TO_EMPTY,
      useBorder: DECORATE_BORDER,
      headerColor: DECORATE_HEADER_COLOR
    };
  }

  /**
   * @param Array data
   * @param Object headers
   * @param String sheetName
   */
  addSheet(headers, data, sheetName) {
    this.sheets.push({
      data: data,
      headers: headers,
      worksheetName: sheetName
    });
  }

  exportExcel() {
    if (this.sheets.length > 0) {
      try {
        Transformer.exportToFile(this.sheets, this.name, this.custom);
        return {
          success: true,
          message: 'Exported successfull to ' + this.name
        };
      } catch (e) {
        return {
          success: false,
          message: 'The exporting process is failure'
        };
      }
    } else {
      return {
        success: false,
        message: 'Please provide least a sheet.'
      };
    }
  }
}

class Transformer {
  static XLS_TEMP_MUTILPLE_SHEET =
    '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">' +
    '<Styles><Style ss:ID="data-val" ss:Name="Normal">${borders}<Alignment ss:Vertical="Center"/><Font ss:Size="11" /></Style>' +
    '<Style ss:ID="header">${borders}<Alignment ss:Horizontal="Center"/><Font ss:Color="${header-color}" ss:Size="10" ss:Bold="1"/><Interior/></Style></Styles>' +
    '${xlsData}</Workbook>';

  static XLS_WORKSHEET =
    '<Worksheet ss:Name="${sheetName}"><Table ss:DefaultColumnWidth="60">${columns}${data}</Table></Worksheet>';

  static XLS_ROW = '<Row>${data}</Row>';

  static XLS_CELL = '<Cell ${style}>${data}</Cell>';

  static XLS_CELL_DATA = '<Data ss:Type="${dataType}">${data}</Data>';

  static XLS_BORDERS =
    '<Borders>' +
    '<Border ss:Color="#444444" ss:LineStyle="Continuous" ss:Weight="1" ss:Position="Left"/>' +
    '<Border ss:Color="#444444" ss:LineStyle="Continuous" ss:Weight="1" ss:Position="Right"/>' +
    '<Border ss:Color="#444444" ss:LineStyle="Continuous" ss:Weight="1" ss:Position="Top"/>' +
    '<Border ss:Color="#444444" ss:LineStyle="Continuous" ss:Weight="1" ss:Position="Bottom"/>' +
    '</Borders>';

  static exportToFile(json_data, filename, options) {
    let xls_data = '';
    for (let index in json_data) {
      let sheet = json_data[index];
      xls_data += Transformer.addSheet(
        Transformer.getProcessedJson(sheet.data, sheet.headers),
        sheet.headers,
        sheet.worksheetName,
        options
      );
    }

    let prepareString = Transformer.XLS_TEMP_MUTILPLE_SHEET.replace(
      /\${borders}/g,
      options.useBorder ? Transformer.XLS_BORDERS : ''
    );
    prepareString = prepareString.replace(
      '${header-color}',
      options.headerColor
    );
    let data = prepareString.replace('${xlsData}', xls_data);
    Transformer.downloadFile(data, filename);
  }

  static base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }

  static addSheet(data, headers, worksheetName, options) {
    let table_data = '';
    let row = '';

    if (data.length > 0) {
      let isCustomHeader = false;
      // Table headers
      if (headers) {
        isCustomHeader = true;
        for (let key in headers) {
          row += Transformer.combineCellData(headers[key].text, 'header');
        }
      } else {
        for (let key in data[0]) {
          row += Transformer.combineCellData(key, 'header');
        }
      }
      table_data += Transformer.XLS_ROW.replace('${data}', row);

      // Table data rows
      for (let index in data) {
        row = '';
        let item = data[index];
        for (let key in item) {
          if (isCustomHeader) {
            if (SUPPORTED_DATA_TYPES.includes(headers[key].type)) {
              Object.assign(options, { type: headers[key].type });
            }
          }
          row += Transformer.combineCellData(item[key], 'data-val', options);
        }

        table_data += Transformer.XLS_ROW.replace('${data}', row);
      }
    } else {
      if (headers) {
        for (let key in headers) {
          row += Transformer.combineCellData(headers[key].text, 'header');
        }
        table_data += Transformer.XLS_ROW.replace('${data}', row);
      }
    }

    return Transformer.addColumns(headers)
      .replace('${sheetName}', worksheetName)
      .replace('${data}', table_data);
  }

  static addColumns(headers) {
    let columns_str = '';
    if (headers) {
      for (let key in headers) {
        let item = headers[key];
        if (item.width) {
          columns_str += '<Column ss:Width="' + item.width + '"/>';
        } else {
          columns_str += '<Column ss:Width="60"/>';
        }
      }
    }
    return Transformer.XLS_WORKSHEET.replace('${columns}', columns_str);
  }

  static combineCellData(data, sytle, options) {
    let styleVal = '';
    let data_type = 'String';

    if (sytle) {
      styleVal = 'ss:StyleID="' + sytle + '"';
    }

    if (options) {
      if (options.isReplace === true && (data == null || data == undefined)) {
        data = '';
      }

      if (options.type) {
        data_type = options.type;
      }
    }

    if (data_type == 'String') {
      data = _.escape(_.trim(data));
      data = data.replace(/\\n/g, '');
    }

    return Transformer.XLS_CELL.replace('${style}', styleVal).replace(
      '${data}',
      Transformer.XLS_CELL_DATA.replace('${data}', data).replace(
        '${dataType}',
        data_type
      )
    );
  }

  static getNestedData(key, item) {
    const field = typeof key === 'object' ? key.field : key;

    let valueFromNestedKey = null;
    let keyNestedSplit = field.split('.');

    valueFromNestedKey = item[keyNestedSplit[0]];
    for (let j = 1; j < keyNestedSplit.length; j++) {
      valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]];
    }

    valueFromNestedKey = Transformer.callItemCallback(key, valueFromNestedKey);

    return valueFromNestedKey;
  }

  static parseExtraData(extraData, format) {
    let parseData = '';
    if (Array.isArray(extraData)) {
      for (var i = 0; i < extraData.length; i++) {
        parseData += format.replace('${data}', extraData[i]);
      }
    } else {
      parseData += format.replace('${data}', extraData);
    }
    return parseData;
  }

  static callItemCallback(field, itemValue) {
    if (typeof field === 'object' && typeof field.callback === 'function') {
      return field.callback(itemValue);
    }
    return itemValue;
  }

  static getProcessedJson(data, header) {
    let keys = Transformer.getKeys(data, header);
    let newData = [];
    for (let index in data) {
      let item = data[index];
      let newItem = {};
      for (let property in keys) {
        newItem[property] = Transformer.getNestedData(property, item);
      }
      newData.push(newItem);
    }

    return newData;
  }

  static getKeys(data, header) {
    if (header) {
      return header;
    }

    let keys = {};
    for (let key in data[0]) {
      keys[key] = key;
    }
    return keys;
  }

  static downloadFile(data, filename) {
    let mime = 'data:application/vnd.ms-excel';
    let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
    let bstr = atob(base64);
    let n = bstr.length;
    let u8arr = new Uint8ClampedArray(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let blobFile = new Blob([u8arr], { type: mime });
    download(blobFile, filename, mime);
  }
}
