class Api::V1::HallsController < ApplicationController
  before_action :get_hall, only: [:show, :update, :destroy]


  def create
    @hall = Hall.create!(hall_params)
    json_response(HallsBlueprint.render_as_json(@hall), :created)
  end

  def index
    @halls = Hall.all
    json_response(HallsBlueprint.render_as_json(@halls, root: :halls))
  end

  def show
    json_response(HallsBlueprint.render_as_json(@hall))
  end

  def destroy
    @hall.destroy
    head :no_content
  end

  def update
    @hall.update!(hall_params)
    json_response(HallsBlueprint.render(@hall))
  end

  private
  def hall_params
    params.permit(:name, :capacity, :department, :hall_file)
  end

  def get_hall
    @hall = Hall.find(params[:id])
  end
end

