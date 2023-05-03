class Api::V1::LoginController < ApplicationController

  def create
    auth_token =
      AuthenticateUser.new(login_params[:email], login_params[:password]).call
    user = User.find_by_email(login_params[:email])
    response = {accessToken: auth_token,
                user: UserBlueprint.render_as_hash(user) ,message: Message.login_success}
    json_response(response)
  end

  private
  def login_params
    params.require(:login).permit(:email, :password)
  end
end
