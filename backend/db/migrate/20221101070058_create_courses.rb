class CreateCourses < ActiveRecord::Migration[7.0]
  def change
    create_table :courses, id: :uuid do |t|
      t.string :name, null:false
      t.integer :level
      t.string :lecturer
      t.string :code, null: false

      t.timestamps
    end
  end
end
