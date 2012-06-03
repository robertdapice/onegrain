class PagesController < ApplicationController
  def index

  end

  def data
    if params[:name]
      @budget_items = BudgetItem.where(:parent_id => BudgetItem.find_by_name(params[:name]).id)
    else
      @budget_items = BudgetItem.where(:parent_id => nil)
    end
    @year = params[:year] || "12_13"
    render 'data'
  end
end
