class Api::V1::CourseController < ApplicationController
  before_action :get_course, only: [:show, :update, :destroy]

  def index
    @courses = CourseBlueprint.render(Course.all, root: :courses)
    json_response(@courses)
  end

  def create
    @course = Course.create!(courses_params)
    json_response(CourseBlueprint.render(@course), :created)
  end

  def destroy
    @course.destroy
    head :no_content
  end

  def update
    @course.update!(courses_params)
    json_response(CourseBlueprint.render(@course))
  end

  def show
    json_response(CourseBlueprint.render(@course))
  end


  private
  def courses_params
    params.permit(:name, :code, :lecturer,:level ,:course_file)
  end

  def get_course
    @course = Course.find(params[:id])
  end
end
