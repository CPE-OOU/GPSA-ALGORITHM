require 'sidekiq/web'

Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: "_interslice_session"
Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  mount Sidekiq::Web => "/sidekiq" #
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resources :users, only: [:create, :index, :show, :update, :destroy]
      resources :course
      resources :login, only: [:create]
      resources :profile, only: [:index, :create]
      resources :admin, only: [:create] do
        post :deactivate, on: :collection
        post :activate, on: :collection
      end
      resources :halls, only: [:create, :index, :show, :update, :destroy]
    end
  end
end
