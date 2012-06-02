class CreateBudgetItems < ActiveRecord::Migration
  def change
    create_table :budget_items do |t|
      t.string :name
      t.integer :parent_id
      t.integer :value12_13
      t.integer :value11_12
      t.text :description
      t.string :url

      t.timestamps
    end
  end
end
