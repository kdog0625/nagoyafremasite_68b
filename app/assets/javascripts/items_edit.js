// $(document).on('turbolinks:load', function(){
  $(function(){

    //プレビューのhtmlを定義
    function buildHTML(count) {
      var html = `<div class="preview-box" id="preview-box__${count}">
                    <div class="upper-box">
                      <img src="" alt="preview">
                    </div>
                    <div class="lower-box">
                      <div class="update-box">
                        <label class="edit_btn">編集</label>
                      </div>
                      <div class="delete-box" id="delete_btn_${count}">
                        <span>削除</span>
                      </div>
                    </div>
                  </div>`
      return html;
    }

    // 投稿編集時
    //items/:i/editページへリンクした際のアクション=======================================
    if (window.location.href.match(/\/items\/\d+/)){
      //登録済み画像のプレビュー表示欄の要素を取得する
      var prevContent = $('.label-content').prev();
      labelWidth = (690 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      $('.label-content').css('width', labelWidth);
      //プレビューにidを追加
      $('.preview-box').each(function(index, box){
        $(box).attr('id', `preview-box__${index}`);
      })
      //削除ボタンにidを追加
      $('.delete-box').each(function(index, box){
        $(box).attr('id', `delete_btn_${index}`);
      })
      var count = $('.preview-box').length;
      //プレビューが5あるときは、投稿ボックスを消しておく
      if (count == 10) {
        $('.label-content').hide();
      }
    }

    // if (window.location.href.match(/\/items\/\d+\/edit/)){
    //   //登録済み画像のプレビュー表示欄の要素を取得する
    //   var prevContent = $('.label-content').prev();
    //   labelWidth = (690 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
    //   $('.label-content').css('width', labelWidth);
    //   //プレビューにidを追加
    //   $('.preview-box').each(function(index, box){
    //     $(box).attr('id', `preview-box__${index}`);
    //   })
    //   //削除ボタンにidを追加
    //   $('.delete-box').each(function(index, box){
    //     $(box).attr('id', `delete_btn_${index}`);
    //   })
    //   var count = $('.preview-box').length;
    //   //プレビューが5あるときは、投稿ボックスを消しておく
    //   if (count == 10) {
    //     $('.label-content').hide();
    //   }
    // }
    //=============================================================================

    // ラベルのwidth操作
    function setLabel() {
      //プレビューボックスのwidthを取得し、maxから引くことでラベルのwidthを決定
      var prevContent = $('.label-content').prev();
      labelWidth = (690 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
      $('.label-content').css('width', labelWidth);
    }

    // プレビューの追加
    $(document).on('change', '.hidden-field', function() {
      console.log("aaa")
      setLabel();
      //hidden-fieldのidの数値のみ取得
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      //labelボックスのidとforを更新
      $('.label-box').attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_url`});
      //選択したfileのオブジェクトを取得
      var file = this.files[0];
      var reader = new FileReader();
      //readAsDataURLで指定したFileオブジェクトを読み込む
      reader.readAsDataURL(file);
      //読み込み時に発火するイベント
      reader.onload = function() {
        var url = this.result;
        //プレビューが元々なかった場合はhtmlを追加
        if ($(`#preview-box__${id}`).length == 0) {
          var count = $('.preview-box').length;
          var html = buildHTML(id);
          //ラベルの直前のプレビュー群にプレビューを追加
          var prevContent = $('.label-content').prev();
          $(prevContent).append(html);
        }
        //イメージを追加
        $(`#preview-box__${id} img`).attr('src', `${url}`);
        var count = $('.preview-box').length;
        //プレビューが5個あったらラベルを隠す 
        if (count == 10) { 
          $('.label-content').hide();
        }

        //プレビュー削除したフィールドにdestroy用のチェックボックスがあった場合、チェックを外す=============
        if ($(`#item_images_attributes_${id}__destroy`)){
          $(`#item_images_attributes_${id}__destroy`).prop('checked',false);
        } 
        //=============================================================================

        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        if(count < 10){
          $('.label-box').attr({id: `label-box--${count}`,for: `item_images_attributes_${count}_url`});
        }
      }
    });

    // 画像の削除
    $(document).on('click', '.delete-box', function() {
      var count = $('.preview-box').length;
      setLabel(count);
      var id = $(this).attr('id').replace(/[^0-9]/g, '');
      $(`#preview-box__${id}`).remove();

      //新規登録時と編集時の場合分け==========================================================

      //新規投稿時
      //削除用チェックボックスの有無で判定
      if ($(`#item_images_attributes_${id}__destroy`).length == 0) {
        //フォームの中身を削除 
        $(`#item_images_attributes_${id}_url`).val("");
        for(var num = 0; num <= id; num++){
          if($(`#delete_btn_${num}`).length == 0) {
          var label_id = num
          break;
          }
          }
        var count = $('.preview-box').length;
        //5個めが消されたらラベルを表示
        if (count == 9) {
          $('.label-content').show();
        }
        setLabel(count);
        if(id < 10){
          $('.label-box').attr({id: `label-box--${label_id}`,for: `item_images_attributes_${label_id}_url`});

        }
      } else {
        $(`#item_images_attributes_${id}_url`).val("");
        for(var num = 0; num <= id; num++){
          if($(`#delete_btn_${num}`).length == 0) {
            var label_id = num
            break;
            }
            }
        //投稿編集時
        $(`#item_images_attributes_${id}__destroy`).prop('checked',true);
        //5個めが消されたらラベルを表示
        if (count == 9) {
          $('.label-content').show();
        }

        //ラベルのwidth操作
        setLabel();
        //ラベルのidとforの値を変更
        //削除したプレビューのidによって、ラベルのidを変更する
        if(id < 10){
          $('.label-box').attr({id: `label-box--${label_id}`,for: `item_images_attributes_${label_id}_url`});
        }
      }
      //=============================================================================
    });
  });
// });

   //価格
   $('.revision-container__content__price__form__box').on('blur',function(){
    let value = $(this).val();
    if(value < 300 || value > 9999999){
      $('#error-price').text('300以上9999999以下で入力してください');
      $(this).css('border-color','red');
    }else{
      $('#error-price').text('');
      $(this).css('border-color','rgb(204, 204, 204)');
    }
  });