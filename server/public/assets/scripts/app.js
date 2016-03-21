$(document).ready(function () {
    appendToDom();
    $('.employee-container').on('click', '.pure-button', deactivateEmployee);
    $('#employeeForm').on('submit', submitNewEmp);
});

// found function numberWithCommas on stackoverflow.com
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function totalMonthlyPay(totalPay) {

  totalPay=Math.round((parseInt(totalPay)/12+0.00001)*100)/100;

  $('.total-pay').text(numberWithCommas(totalPay));
}

//deactivate employee status
function deactivateEmployee(event) {
  event.preventDefault();
  // get empID
  var empID = $(this).parent().parent().find('td:eq(3)').text();
  //var highlight = $(this);
  $.ajax({
    type: 'PUT',
    url: '/employees',
    data: {'employee_id': empID},
    success: appendToDom
  });

}
// display employees to the DOM
function appendToDom(){
  var totalPay = 0;
  $('tbody').empty();
  $.ajax({
    type: 'GET',
    url: '/employees',
    success: function(data){
        for(var i=0; i<data.length; i++){
          var employee = data[i];

          $("tbody").append('<tr class="employee"></tr>');
          var $el = $("tbody").children().last();
          $el.append('<td></td>');
          $el.append('<td>'+employee.first_name+'</td>');
          $el.append('<td>'+employee.last_name+'</td>');
          $el.append('<td >'+employee.employee_id+'</td>');
          $el.append('<td>'+employee.job_title+'</td>');
          $el.append('<td>$'+numberWithCommas(employee.salary)+'</td>');
          if(employee.status){
            totalPay += parseInt(employee.salary);
            $el.append('<td><button class="pure-button pure-button-primary">On/Off</button></td>');
          }else{
          $el.append('<td><button class="pure-button pure-button-primary red">On/Off</button></td>');
          }
        }
        totalMonthlyPay(totalPay);
    }
  });
}

//add employee to DB
function addEmployee(employee) {

  $.ajax({
    type: 'POST',
    url: '/employees',
    data: employee,
    success: appendToDom
  });
}

// submit new employee Data from form
function sumbitNewEmp(event) {
    event.preventDefault();
    var employee = {};

    //collect data from filled fields
    $.each($('#employeeForm').serializeArray(), function (i, field) {
      employee[field.name] = field.value;

    });

    //clear fields after submit
    $('#employeeForm').find('input[type=text]').val('');
    $('#employeeForm').find('input[type=number]').val('');

    $("#firstname").trigger("focus");
    //now add employee to DB
    addEmployee(employee);
}
