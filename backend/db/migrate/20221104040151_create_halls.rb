class CreateHalls < ActiveRecord::Migration[7.0]
  def change
    create_table :halls, id: :uuid do |t|
      t.string :name, null: false
      t.integer :caepacity, null: false
      t.integer :row_length, null: false
      t.string :department
      t.integer :bad_seats, array: true, default: []

      t.timestamps
    end
  end
end
