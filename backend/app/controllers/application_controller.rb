class ApplicationController < ActionController::API
  include Response
  include ExceptionHandler

  attr_reader :current_user

  def authenticate_request!
    @current_user = AuthorizeUser.new(request.headers).call[:user]
  end
end
