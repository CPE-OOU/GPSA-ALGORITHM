class AddDepartmentToCourse < ActiveRecord::Migration[7.0]
  def change
    add_column :courses, :department, :string
  end
end
