// $(document).on('turbolinks:load', ()=> {
  document.addEventListener(
    "DOMContentLoaded", e => {
    if (document.getElementById("new-paysecurity-point-btn") != null) {
       //token_submitというidがnullの場合、下記コードを実行しない
      Payjp.setPublicKey("pk_test_b089d88c3064a7ce30ce63ae"); //ここに公開鍵を直書き

      let btn = document.getElementById("new-paysecurity-point-btn"); //IDがtoken_submitの場合に取得されます
      btn.addEventListener("click", e => { //ボタンが押されたときに作動します
        e.preventDefault(); //ボタンを一旦無効化します
        let card = {
          number: document.getElementById("card_number").value,
          cvc: document.getElementById("seculity_code").value,
          exp_month: document.getElementById("exp_month").value,
          exp_year: document.getElementById("exp_year").value
        }; //入力されたデータを取得します。
        Payjp.createToken(card, (status, response) => {
          console.log(status)
          if (status === 200) { //成功した場合
            $("#card_number").removeAttr("name");
            $("#seculity_code").removeAttr("name");
            $("#exp_month").removeAttr("name");
            $("#exp_year").removeAttr("name"); //データを自サーバにpostしないように削除
            $('#card_token').append(
              $('<input type="hidden" name="payjp-token">').val(response.id)
            ); //取得したトークンを送信できる状態にします
            document.inputForm.submit();
            alert("登録が完了しました"); //確認用
          } else {
            alert("カード情報が正しくありません。"); //確認用
           
          }
        });
      });
    }
  },
  false
)
