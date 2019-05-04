import XLSX from 'xlsx';

export default class Importer {
  /**
   * Return MAP contain json data corresponding worksheet.
   * @param FILE file
   * @param STRING ARRAY wooksheets
   */
  static async readXLSX(file, wooksheets, { rABS } = {}) {
    let reader;
    if (rABS) {
      reader = new XLSX_Reader(true);
    } else {
      reader = new XLSX_Reader();
    }

    return await reader.readFile(file, wooksheets);
  }

  /**
   * Return json data of the first sheet.
   * @param FILE file
   */
  static async readXLSXAllSheet(file, { rABS } = {}) {
    let reader;
    if (rABS) {
      reader = new XLSX_Reader(true);
    } else {
      reader = new XLSX_Reader();
    }

    return await reader.readFile(file, []);
  }

  /**
   * Rename property name for each item in data array
   * @param ARRAY data
   * @param OBJECT properties
   */
  static correctJsonPropertyName(data, properties) {
    try {
      if (Object.keys(properties).length == 0 || data.length == 0)
        return {
          success: false,
          message: 'Wrong arguments'
        };
    } catch (e) {
      return {
        success: false,
        message: 'Wrong arguments'
      };
    }

    let result = [];
    for (let index in data) {
      let element = data[index];
      let new_element = {};
      for (let property_name in properties) {
        if (element[properties[property_name].name] != undefined) {
          new_element[property_name] = element[properties[property_name].name];
        } else {
          new_element[property_name] = '';
        }
      }
      let valid = Ulti.validate(new_element, properties);
      if (valid.success) {
        result.push(valid.data);
      } else {
        return valid;
      }
    }

    return {
      success: true,
      data: result
    };
  }
}

class Ulti {
  static validate(data, properties) {
    let result = {};
    for (let property_name in properties) {
      let raw_data = data[property_name].trim();
      let type = properties[property_name].type;
      if (!type) {
        type = 'String';
      }

      switch (type) {
        case 'String':
          // Ignore
          result[property_name] = data[property_name];
          break;
        case 'Number':
          if (!Number.isNaN(Number(raw_data))) {
            result[property_name] = Number(raw_data);
          } else {
            return {
              success: false,
              message:
                'The value of collumn [' +
                properties[property_name].name +
                ' <' +
                (raw_data == '' ? 'EMPTY VALUE' : raw_data) +
                '>] must be NUMBER'
            };
          }
          break;
        case 'Boolean':
          if (raw_data == 'true' || raw_data == 'false') {
            result[property_name] = raw_data == 'true';
          } else {
            return {
              success: false,
              message:
                'The value of collumn [' +
                properties[property_name].name +
                ' <' +
                (raw_data == '' ? 'EMPTY VALUE' : raw_data) +
                '>] must be TRUE or FALSE'
            };
          }
          break;
        default:
          // Ignore
          result[property_name] = data[property_name];
          break;
      }
    }
    return { success: true, data: result };
  }
}

class XLSX_Reader {
  constructor(rABS) {
    this.rABS = rABS;
  }

  async readFile(file, wooksheets) {
    return await this.fileConvertToWorkbook(file)
      .then(workbook => {
        let result_data = {};
        if (wooksheets.length == 0) {
          for (let index in workbook.SheetNames) {
            let xlsxArr = XLSX.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[index]]
            );
            result_data[workbook.SheetNames[index]] = xlsxArr;
          }
        } else {
          for (let index in wooksheets) {
            let sheet_name = wooksheets[index];
            let xlsxArr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name]);
            if (xlsxArr) {
              result_data[sheet_name] = xlsxArr;
            }
          }
        }
        return {
          success: true,
          data: result_data
        };
      })
      .catch(err => {
        return {
          sucess: false,
          message: err
        };
      });
  }

  fileConvertToWorkbook(file) {
    let reader = new FileReader();
    let fixdata = data => {
      let o = '',
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    };
    return new Promise((resolve, reject) => {
      try {
        reader.onload = renderEvent => {
          let data = renderEvent.target.result;
          if (this.rABS) {
            /* if binary string, read with type 'binary' */
            resolve(XLSX.read(data, { type: 'binary' }));
          } else {
            /* if array buffer, convert to base64 */
            let arr = fixdata(data);
            resolve(XLSX.read(btoa(arr), { type: 'base64' }));
          }
        };
        reader.onerror = error => {
          reject(error);
        };
        if (this.rABS) {
          reader.readAsBinaryString(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
