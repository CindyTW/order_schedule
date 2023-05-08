/* ==== Header    =====*/
$(function () {
    $('#header').load("header.html");
    $('#footer').load("footer.html");
});


/* =========== Date format ============ */

const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
  
 
const date = year + "/" + month + "/" + day;
  
 
setInterval(function() {
    var now = new Date(); 
    var hours = now.getHours() % 12 || 12;
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    var amPm = now.getHours() < 12 ? "上午" : "下午";
    var time = amPm + " " + hours + ":" + minutes + ":" + seconds;
    datetime.innerHTML = "今日時間：" + date + ", " + time;

}, 1000);



/* ============ Submenu disply ============= */ 
