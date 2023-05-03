class Api::V1::ProfileController < ApplicationController
  before_action :authenticate_request!, only: [:index]

  def index
    response = UserBlueprint.render_as_hash(current_user)
    json_response({user: response})
  end
end
