Rails.application.routes.draw do
  
  
  # get 'credit_cards/index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_for :users, :controllers => {
    registrations: 'users/registrations',
    sessions: 'users/sessions'   
  } 
  
  resources :items do
    resources :comments,only: [:create]
    #Ajaxで動くアクションのルートを作成
    collection do
      get 'get_category_children', defaults: { format: 'json' }
      get 'get_category_grandchildren', defaults: { format: 'json' }
    end
  end

  root 'items#index'

  resources :items do
    member do
      get 'purchase'
      post 'purchase'
      get 'pay'
    end
    collection do
      get 'done'
    end
  end
 
  resources :users do
   resource :logout ,only: [:show]
  end
  resources :credit_cards do
   
  end




  
  
  get 'logouts/show'

end
