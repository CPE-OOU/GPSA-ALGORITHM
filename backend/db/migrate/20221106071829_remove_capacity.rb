class RemoveCapacity < ActiveRecord::Migration[7.0]
  def change
    remove_column :halls, :caepacity
    add_column :halls, :capacity, :integer
  end
end
