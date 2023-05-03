class HallsBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :capacity, :department

  field :file do |hall|
    if hall.hall_file.attached?
      {
        url: UrlHelper.instance.url_for(hall.hall_file)
      }
    end
  end
end
