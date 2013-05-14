class BudgetItem < ActiveRecord::Base
  belongs_to :parent, :class_name => "BudgetItem"
  has_many :children, :class_name => "BudgetItem", :foreign_key => "parent_id"

  def self.full_tree
    result = Rails.cache.fetch("full-budget-tree", :expires_in => Rails.env.development? ? 1.second : 12.hours) do
      self.where(:parent_id => nil).map{|item| item.with_children.to_json}.join(",").html_safe
    end
  end

  def with_children
    data = {}
    data[:name] = self.name
    data[:value13_14] = self.value12_13
    data[:value12_13] = self.value11_12
    if self.children.length > 0
      data[:children] = self.children.map{|child| child.with_children}
    else
      data[:source_name] = self.source_name
      data[:source_url] = self.source_url
      data[:description] = self.description
    end
    data
  end

  def value11_12
    children.length > 0 ? children.map(&:value11_12).sum : self[:value11_12]
  end

  def value12_13
    children.length > 0 ? children.map(&:value12_13).sum : self[:value12_13]
  end

end
