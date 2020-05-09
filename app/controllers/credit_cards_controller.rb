class CreditCardsController < ApplicationController
  def index
    @CreditCards=CreditCard.all
    @CreditCard=CreditCard.new
  end
  def new
    @CreditCard=CreditCard.new
  end
  def create
    @CreditCard=CreditCard.create(credit_params)
  end

  private
  def credit_params
    params.require(:credit_card).permit(:name,:card_number,:expriation_year,:expriation_month,:seculity_code).merge(user_id: current_user.id)
  end

end
