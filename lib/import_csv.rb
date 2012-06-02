class ImportCsv
  attr_accessor :file
  def initialize(file)
    @file = file
    @model = BudgetItem
  end
  require 'csv'
  def import
    header = true
    CSV.open(@file, "r", ?,, ?\r) do |row|
      if !header
        new_record = BudgetItem.new
        new_record.description = row[7]
        new_record.source_name = row[8]
        new_record.source_url = row[9]
        new_record.value12_13 = row[6].gsub(/\,/,"").to_i
        new_record.value11_12 = row[5].gsub(/\,/,"").to_i
        categories = {1 => row[0], 2 => row[1], 3 => row[2], 4 => row[3], 5 => row[4]}
        category_count = categories.values.select{|name| name && name != ""}.count
        new_record.name = categories[category_count]
        parents = []
        (1..category_count-1).each do |cat_id|
          if cat_id == 1
            parents[cat_id] = BudgetItem.find_or_create_by_name(:name => categories[cat_id])
          else
            parents[cat_id] = BudgetItem.find_or_create_by_name_and_parent_id(:name => categories[cat_id], :parent_id => parents[cat_id-1].id)
          end
        end
        new_record.parent_id = parents[category_count - 1].id if category_count > 1
        new_record.save!
      else
        header = false
      end
    end
  end
end