class RemoveRowLenght < ActiveRecord::Migration[7.0]
  def change
    remove_column :halls, :row_length
  end
end
