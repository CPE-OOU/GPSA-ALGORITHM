class Api::V1::UsersController < ApplicationController
  before_action :get_user, only: [:show, :update, :destroy]
  wrap_parameters :user, include: [:first_name, :last_name, :email, :password, :age, :gender]

  def create
    @user = User.create!(user_params)
    response = UserBlueprint.render(@user)
    json_response(response, :created)
  end

  def index
    @users = User.where.not(role: 'developer')
    json_response(UserBlueprint.render(@users, root: :users))
  end

  def destroy
    @user.destroy
    head :no_content
  end

  def update
    @user.update!(user_params)
    json_response(UserBlueprint.render(@user))
  end

  def show
    json_response(UserBlueprint.render(@user))
  end


  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :age, :gender, :password)
  end
  def get_user
    @user = User.find(params[:id])
  end
end
