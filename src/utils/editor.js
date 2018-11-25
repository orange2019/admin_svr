class Editor {

  createEditor(element) {

    let editor = KindEditor.create('#' + element, {
      filterMode: false,
      allowFileManager: false,
      uploadJson: '/upload',
      //  fileManagerJson : '/file/data',
      formatUploadUrl: false,
      allowImageRemote: true,
      afterBlur: function () {
        this.sync()
      },
      themeType: 'simple'
    })

    return editor

  }

  async createImgBtn(element , store) {
    console.log('editoe.createImgBtn store' , store.state)
    let uploadbutton = KindEditor.uploadbutton({
      // button: document.getElementById(element),
      button: KindEditor('#' + element)[0],
      fieldName: 'imgFile',
      url: '/upload',
      afterUpload: function (data) {
        // console.log('afterUpload,data' , data)
        if (data.error === 0) {
          // alert(data.url);
          store.state.newsData.cover = data.url

        } else {

          alert(data.message);
        }
      },
      afterError: function (str) {
        alert('上传失败: ' + str);
      }
    });
    uploadbutton.fileBox.change(function (e) {
      uploadbutton.submit();
    });

    return uploadbutton
  }

}

export default new Editor