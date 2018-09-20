$(document).ready(function () {
  $prdId = $('#prd-id').text();
  $slcColor = $('#slc-color');
  $slcSize = $('#slc-size');
  $btnAdd = $('#btn-add');
  $link = $btnAdd.attr('href');
  //add product to cart
  $btnAdd.click(function () {
   $color = $slcColor.val();
   $size = $slcSize.val();
   $.ajax({
    url: '/add-cart/'+ $prdId+ '?color='+ $color +'&size=' + $size,
    type: 'GET',
    dataType: 'html',
    success: function (data) {
      window.location = '/cart';
    }
  });
 });
  //change select color
  $slcColor.change(function () {
    $color = $slcColor.val();
    $.ajax({
      url: '/select-color/'+ $prdId+ '?color='+ $color,
      type: 'get',
      dataType: 'json',
      success: function (data) {
        if (data) {
          $listOption = '';
          for(size of data) {
            $listOption += '<option value="'+ size +'">Size: '+ size +'</option>';
          }
          $slcSize.html($listOption);
        } else {
          console.log('not found');
        }
      }
    });
  });

});