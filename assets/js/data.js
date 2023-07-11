"use strict";
function set_data(name,data){
  localStorage.setItem(name,data);
}
function get_data(data){
  return localStorage.getItem(data);
}
 let dataArray  = [];
 let dataArray2 = [];
//$(document).ready(()=>{
  var ix = $("#index");
  var cn = $("#categoey_name");
  var rn = $("#reason");
  var at = $("#amount");
  var cd = $("#cat_date");
  $("#add_data").click((event)=>{
    if (cn.val() !== "" && rn.val() !== "" && at.val() !== "" && cd.val() !== "" ) {
      event.preventDefault();
      var total_a_e = Number(at.val()) + Number($("#expo").text());
      if(cn.val() == "مصروفات" && total_a_e > Number($("#impo").text())){
        swal("! تنبيه", "الإيرادات غير كافية", "warning");
      }else{
        dataArray.push({"categoey_name":cn.val(),"reason":rn.val(),"amount":at.val(),"cat_date":cd.val() });
        if( get_data( "database") === 'undefined'){
          set_data( "database" , JSON.stringify(dataArray) );
        }else{
          dataArray2 = dataArray.concat( JSON.parse(get_data("database")) );
          set_data( "database" , JSON.stringify(dataArray2) );
        }
        rn.val("");    
        at.val("");    
        cd.val(""); 
        $('#categoey_name option').each(function() {
          if($(this).val() == ""){
            $(this).attr("selected","true")
          }
        });
        swal({
          title: "",
          text: `
          تم إضافة البيانات بنجاح
          ` ,
          type: "success",
          confirmButtonClass: 'btn-outline-success',
          confirmButtonText: 'Ok!'
        });
        show();
      }
    }
  });
  // view data 
  function show(){
    let imp       = 0;
    let exp       = 0;
    let remaining = 0;
    let total     = 0;
    let tr        = ""; 
    JSON.parse(get_data("database")).map((item,index)=>{
      tr += `<tr>
                <td>
                <i onclick="delete_(${index})" class="fa fa-trash text-danger button"></i>
                &emsp;| &emsp;
                <i onclick="select_data(${index})" class="fa fa-edit text-success button"></i> 
                </td>
                <td>${item.reason}</td>
                <td>${item.amount}</td>
                <td>${item.categoey_name}</td>
                <td>${item.cat_date}</td>
                <td>${index+1}</td>
             </tr>`;
             if(item.categoey_name === "إيرادات"){
               imp += Number(item.amount);
             }else{
               exp += Number(item.amount);
             }
    });
    $("#table-id tbody").html(tr);
    $("#expo").text(exp);
    $("#impo").text(imp);
    imp = Number(imp);
    exp = Number(exp);
    remaining = imp - exp;
    $("#rem").text(remaining);
    var percent = (remaining * 100) / imp;
    $("#rate").text(Math.floor(percent));
    
    if(percent < 70 && percent > 30){
      $(".progress-bar").css('background', 'orange');
    }else if(percent < 30){
       $(".progress-bar").css('background','red');
    }else{
      $(".progress-bar").css('background','green');
    }
    
    $(".progress-bar").width(Math.floor(percent)+"%");
  }
  show();
//});
  // Edit Data 
  function select_data(id){
    var data = JSON.parse(get_data("database"));
    ix.val(id);
    data.map((item,index)=>{
      if(index == id){
        rn.val(item.reason)
        at.val(item.amount)
        cd.val(item.cat_date)
        $('#categoey_name option').each(function() {
          if($(this).val() == item.categoey_name){
            if ($(this).attr("selected")) {
              $(this).removeAttr("selected");
            } else {
              $(this).attr("selected","true");
            }
          }
        });
      }
      $("#add_data").addClass('d-none');
      $("#edit_data").removeClass('d-none');
    });
    show();
  }
  $("#edit_data").click(()=>{
    if (cn.val() !== "" && rn.val() !== "" && at.val() !== "" && cd.val() !== "" ) {
      event.preventDefault();
      var data = JSON.parse(get_data("database"));
      var index = ix.val();
      data[index].categoey_name = cn.val();
      data[index].reason = rn.val();
      data[index].amount = at.val();
      data[index].cat_date = cd.val();
      set_data( "database" , JSON.stringify(data) );
      show();    
      $("#edit_data").addClass('d-none');
      $("#add_data").removeClass('d-none');
      rn.val("");    
      at.val("");    
      cd.val(""); 
      $('#categoey_name option').each(function() {
        if($(this).val() == ""){
          $(this).attr("selected","true")
        }
      });
      swal({
        title: "",
        text: `
        تم تعديل البيانات بنجاح
        ` ,
        type: "success",
        confirmButtonClass: 'btn-outline-success',
        confirmButtonText: 'Ok!'
      });
    }
  });
  // Delete Data 
  function delete_(id){
    var indexToDelete = id;
    var data = JSON.parse( get_data("database") );
    data.splice(indexToDelete, 1);
    swal({
      title: "هل تريد حذف البيانات المحدده؟",
      text: "سيتم حذف البيانات المحدده بشكل نهائي",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("!تم الحذف بنجاح", {
          icon: "success",
        });
        set_data( "database" , JSON.stringify( data ) );
        show();
        if(data.length < 1){
          $(".progress-bar").width("0%");
          $("#rate").text(0);
        }
      } else {
        swal("لم يتم الحذف!");
      }
    });
  }
  // Export database
  function export_data(){
    const blob = new Blob([get_data("database")], { type: 'application/text' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Expenses.db';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  function import_data(){
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = e.target.result;
      set_data( "database" , text );
    };
    reader.readAsText(file);
    setTimeout(function() {location.reload();}, 1000);
}
//localStorage.clear();
/*
|======================================
|
|      Programming  : Adel Mahmoud
|      Phone Number : +201018646196
|   
|======================================
*/
/*
var myData = [
 {"categoey_name":"إيرادات","reason":"salary","amount":"7000","cat_date":"1345777" },
 {"categoey_name":"مصروفات","reason":"cookie","amount":"2000","cat_date":"1345777" },
 {"categoey_name":"مصروفات","reason":"cars","amount":"1000","cat_date":"1345777" },
 {"categoey_name":"مصروفات","reason":"phone","amount":"2000","cat_date":"1345777" }
];
set_data("database",JSON.stringify( myData ));
*/  