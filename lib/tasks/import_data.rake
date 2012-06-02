desc "Import Budget data"
task :import_data => :environment do |t, args|
  p "Destroying all existing data"
  BudgetItem.destroy_all
  p "Starting to import CSV data from 'budget_data.csv'."
  parse = ImportCsv.new("#{Rails.root}/budget_data.csv")
  parse.import
  p "Completed import successfully."
end
