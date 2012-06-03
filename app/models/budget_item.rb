class BudgetItem < ActiveRecord::Base
  belongs_to :parent, :class_name => "BudgetItem"
  has_many :children, :class_name => "BudgetItem", :foreign_key => "parent_id"

  def with_children(year = "12_13")
    data = {}
    data[:name] = self.name
    if self.children.length > 0
      data[:children] = self.children.map{|child| child.with_children(year)}
    else
      data[:size] = self.send("value" + year)
    end
    data
  end
end
