class PagesController < ApplicationController
  before_filter :allow_all_domains

  def index

  end

  def narrow_index

  end

  def data
    # if params[:name]
    #   @budget_items = BudgetItem.where(:parent_id => BudgetItem.find_by_name(params[:name]).id)
    # else
    #   @budget_items = BudgetItem.where(:parent_id => nil)
    # end
    render 'data'
  end

  private

    def allow_all_domains
      headers["Access-Control-Allow-Origin"] = "*"
    end
end
