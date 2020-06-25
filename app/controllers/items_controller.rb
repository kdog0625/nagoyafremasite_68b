class ItemsController < ApplicationController
  before_action :set_item, only: [:edit, :show, :destroy, :update, :purchase, :pay]
  before_action :set_card, only: [:purchase, :pay]
  before_action :category_parents, only: [:new, :edit]
  def index
    @items = Item.includes(:images).order('created_at DESC').limit(12)
    @parents = Category.where(ancestry: nil)
  end

# カテゴリーセレクトボックスの設定
  def category_parents
    #セレクトボックスの初期値設定
    @category_parent_array = []
    #データベースから、親カテゴリーのみ抽出し、配列化
    Category.where(ancestry: nil).limit(13).each do |parent|
      @category_parent_array << parent
    end
  end

  def new
    @item = Item.new
    @item.images.new
  end


  def create
    @item = Item.new(item_params)
    if @item.save
      flash[:alert] = "商品が出品されました。"
      redirect_to root_path
    else
      @item.images.new
      @category_parent_array = []
      Category.where(ancestry: nil).limit(2632).each do |parent|
        @category_parent_array << parent
      end
      flash[:alert] = "必須項目をご確認ください。"
      render :new
    end
  end
  # 親カテゴリーが選択された後に動くアクション
  def get_category_children
    respond_to do |format|
      format.html
      format.json do
      @category_children = Category.where(ancestry: "#{params[:parent_id]}")
      #親カテゴリーに紐付く子カテゴリーを取得
      end
    end
  end 
    # 子カテゴリーが選択された後に動くアクション
  def get_category_grandchildren
    #binding.pry
    # @category_grandchildren = Category.where(ancestry: "#{params[:child_id]}")
    category=Category.find(params[:child_id])
    @category_grandchildren=category.children
    #子カテゴリーに紐付く孫カテゴリーの配列を取得
  end

  def show
    @parents = Category.all.order("id ASC").limit(1316)
    @comment = Comment.new
    @comments = @item.comments.includes(:user)
  end

  def edit
  end

  def update
    # binding.pry
    if @item.update(item_update_params)
      flash[:alert] = "出品商品が編集されました。"
      redirect_to root_path
    else
      @item.images=Image.where(item_id:@item.id)
      @category_parent_array = []
    #データベースから、親カテゴリーのみ抽出し、配列化
    Category.where(ancestry: nil).limit(13).each do |parent|
      @category_parent_array << parent
    end
      flash[:alert] = "必須項目をご確認ください。"
      render action: :edit
    end
  end

  def destroy
    if @item.destroy
      redirect_to root_path
    else 
      render show
    end
  end
  
  def purchase
    if @credit_card.blank?
      redirect_to controller: 'credit_cards', action: 'new'
    else
      Payjp.api_key = Rails.application.credentials.payjp[:payjp_secret_key]
      customer = Payjp::Customer.retrieve(@credit_card.customer_id)
      @default_card_information = customer.cards.retrieve(@credit_card.card_id)
    end
    
    
  end

  def pay
    Payjp.api_key = Rails.application.credentials.payjp[:payjp_secret_key]
    Payjp::Charge.create(
    amount: @item.price, #支払金額を入力（itemテーブル等に紐づけても良い）
    customer: @credit_card.customer_id, #顧客ID
    currency: 'jpy', #日本円
    )
  @product_purchaser= Item.find(params[:id])
    if @product_purchaser.update( buyer_id: current_user.id)
      redirect_to controller: 'items', action: 'index' #完了画面に移動
    else 
      redirect_to controller: 'items', action: 'purchase'
    end
  end

  def done
  end
  def set_item
    @item = Item.find(params[:id])
  end
  
  def set_card
    @credit_card = CreditCard.where(user_id: current_user.id).first
  end
  
  private

  def item_params
    params.require(:item).permit(:name, :price, :introduction, :category_id, :item_condition, :brand_id, :shipping_area, :preparation_day, :trading_status, :postage_type, images_attributes: [:url]).merge(user_id: current_user.id)
  end

  
  def item_update_params
    params.require(:item).permit(:name, :price, :introduction, :category_id, :item_condition, :brand_id, :shipping_area, :preparation_day, :trading_status, :postage_type, images_attributes: [:url, :id, :_destroy]).merge(user_id: current_user.id)
      
  end

  
end