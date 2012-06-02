class BudgetItem < ActiveRecord::Base
  belongs_to :parent, :class_name => "BudgetItem"
  has_many :children, :class_name => "BudgetItem", :foreign_key => "parent_id"

  def with_children
    data = {}
    data[:name] = self.name
    if self.children.length > 0
      data[:children] = self.children.map{|child| child.with_children}
    else
      data[:size] = self.value12_13
    end
    data
  end
end
