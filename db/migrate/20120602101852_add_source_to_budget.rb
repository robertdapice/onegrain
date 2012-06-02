class AddSourceToBudget < ActiveRecord::Migration
  def self.up
    add_column :budget_items, :source_name, :string
    add_column :budget_items, :source_url, :string
  end

  def self.down
    remove_column :budget_items, :source_url
    remove_column :budget_items, :source_name
  end
end