require 'json'
class Api::V1::AdminController < ApplicationController
  before_action :get_admin, only: [:deactivate, :activate]


  def create
    @user = User.create! admin_params do |u|
      u.role = 1
      u.password = SecureRandom.hex(3)
    end
    args = {id: @user.id, password: @user.password}
    EmailJob.perform_async(JSON.parse(args.to_json))
    json_response({message: "Admin invited successfully"})
  end

  def deactivate
    @user.deactivate
    json_response(UserBlueprint.render(@user))
  end





  def activate
    @user.activate
    json_response(UserBlueprint.render(@user))
  end

  private
  def admin_params
    params.require(:admin).permit(:email,:first_name,:last_name)
  end
  def get_admin
    @user = User.find(params[:id])
  end
end
