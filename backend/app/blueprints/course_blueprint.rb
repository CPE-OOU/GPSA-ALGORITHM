class CourseBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :level, :lecturer, :code, :created_at, :updated_at

  field :file do |course|
    if course.course_file.attached?
      {
        url: UrlHelper.instance.url_for(course.course_file)
      }
    end
  end
end
