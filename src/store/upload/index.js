// const Request = require('./../../api/common/request')
// import Request from './../../api/common/request'
import XLS from 'js-xlsx'

class Upload {

  
  async uploadExcel(file,type = "read") {
    switch(type){
      case 'read':
        return await this._excelToJson(XLS.readFile)
        break;
      case 'write':
        // return 
        break;
    }
  }

  /**
   * excel 转换成json
   * @param {*} workbook 
   */
  async _excelToJson(workbook) {
    var result = {};
    // 获取 Excel 中所有表名
    // var sheetNames = workbook.SheetNames; 
    workbook.SheetNames.forEach(function(sheetName) {
      var worksheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
    });	
    console.log("打印表信息",JSON.stringify(result));  
    return result;
  }
}

export default new Upload