Dropzone.options.uploadWidget = {
  paramName: 'fImage',
  maxFilesize: 20,
  maxFiles: 10,
  dictDefaultMessage: 'Kéo thả hình vào ô hoặc click vào ô để chọn 1 hình',
  headers: {
    'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
  },
  acceptedFiles: 'image/*',
  init: function() {
    this.on('success', function( file, resp ){
      console.log( file );
      console.log( resp);
    });
    this.on('thumbnail', function(file) {
      if (file.width < 100 || file.height < 100) {
        file.rejectDimensions();
      } else {
        file.acceptDimensions();
      }
    });
  },
  accept: function(file, done) {
    file.acceptDimensions = done;
    file.rejectDimensions = function() {
      done('Kích thước hình ảnh phải lớn hơn 100px x 100px')
    };
  }
};