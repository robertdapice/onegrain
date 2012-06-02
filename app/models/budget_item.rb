class BudgetItem < ActiveRecord::Base
  def self.read_education
    results = []
    search_text = %&Revised Budget Forw ard Forw ard Forw ard\r\\\nbudget year 1 year 2 year 3\r\\\n$'000 $'000 $'000 $'000 $'000\r\\\n&
    line_breaker_text = %&\r\\\n&
    text = File.open("education_report.rtf").read
    still_searching = true
    end_result_offset = 0
    begin
      start_first_result = text.index(search_text, end_result_offset)
      if !start_first_result.nil?
        start_first_result = text.index(line_breaker_text, start_first_result + search_text.length) + line_breaker_text.length
        entry_name = text[start_first_result..text.index(/\d/, start_first_result)-1].strip
        first_value = text[start_first_result..start_first_result+100].scan(/\s(\d{0,3}\,)*(\d{1,3})\s/)[0]
        if first_value
          value11_12 = text[start_first_result..start_first_result+200].scan(/\s\d{0,3}\,(\d{1,3})\s/)[0].gsub(/\,/, "").to_i
          value10_11 = text[start_first_result..start_first_result+200].scan(/\s(\d{0,3}\,)*(\d{1,3})\s/)[1].gsub(/\,/, "").to_i
          results.push({:name => entry_name, :val11_12 => value11_12, :val10_11 => value10_11})
          puts "Found result: " + results.last.inspect
        end
        # text[start_first_result..start_first_result+600]
        end_result_offset = start_first_result + 300
      else
        still_searching = false
      end
    end while still_searching
    puts results.inspect
  end
end
