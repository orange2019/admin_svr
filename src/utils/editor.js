class Editor {

  async init() {
    return new Promise((r, j) => {
      KindEditor.ready(K => {
        r(K)
      })
    })
  }

  async createEditor(element) {

    let K = await this.init()

    return K.create(element, {
      filterMode: false,
      allowFileManager: false,
       uploadJson : '/upload',
      //  fileManagerJson : '/file/data',
      formatUploadUrl: false,
      allowImageRemote: true,
      afterBlur: function () {
        this.sync()
      }
    })

  }

  async createImgBtn(element , valInput , imgPre) {

    let K = await this.init()

    console.log('createImgBtn ==========' , K(element)[0])

    var uploadbutton = K.uploadbutton({
      button: K(element)[0],
      fieldName: 'imgFile',
      url: '/upload',
      afterUpload: function (data) {
        console.log('afterUpload,data' , data)
        if (data.error === 0) {
          // alert(data.url);
          document.getElementById(valInput).value = data.url
          document.getElementById(imgPre).src = data.url
        } else {
          
          alert(data.message);
        }
      },
      afterError : function(str) {
        alert('上传失败: ' + str);
        // document.getElementById(valInput).value = 'http://placehold.it/300x200'
        // document.getElementById(imgPre).src = 'http://placehold.it/300x200'
      }
    });
    uploadbutton.fileBox.change(function (e) {
      uploadbutton.submit();
    });
  }

}

export default new Editor