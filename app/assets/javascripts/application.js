// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


function populateSidebar(budgetItem) {
  $("#item_name").text(budgetItem.name)
  $("#value11_12").text("$" + add_commas(round_to_dp(budgetItem.value11_12/1000,0).toString()) + " million")
  $("#value12_13").text("$" + add_commas(round_to_dp(budgetItem.value12_13/1000,0).toString()) + " million")
  $("#value_change").text(round_to_dp(100*budgetItem.value12_13/budgetItem.value11_12 - 100, 1).toString() + "%");
  if (!budgetItem.children) {
    $("#item_description").text(budgetItem.description || "None available")
    $("#item_source").html("<a href='" + budgetItem.source_url + "'>" + budgetItem.source_name + "</a>")
  } else {
    $("#item_description").text(budgetItem.description || "None available")
    $("#item_source").html("")
  }
}

function add_commas(string){
  return string.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function round_to_dp(number, decimal_places){
  factor = Math.pow(10,decimal_places);
  return Math.round(factor*number)/factor;
}
