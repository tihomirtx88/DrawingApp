$(function () {
  let paint = false;
  let paint_erase = "paint";

  const canvas = document.getElementById("paint");
  const ctx = canvas.getContext("2d");
  const container = $("#container");

  const mouse = {
    x: 0,
    y: 0,
  };
  // Undo / Redo Functionality
  let history = [];
  let step = -1;

  // Undo / Redo Functionality
  function saveState() {
    step++;
    if (step < history.length) history.length = step;
    history.push(canvas.toDataURL());
  }

  function undo() {
    if (step > 0) {
      step--;
      let canvasPic = new Image();
      canvasPic.src = history[step];
      canvasPic.onload = () => ctx.drawImage(canvasPic, 0, 0);
    }
  }

  function redo() {
    if (step < history.length - 1) {
      step++;
      const img = new Image();
      img.src = history[step];
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  }

  // -----------------------------

  if (localStorage.getItem("imgCanvas") != null) {
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = localStorage.getItem("imgCanvas");
  }
  //set drawing parameters (lineWidth, lineJoin, lineCap)
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  container.mousedown(function (e) {
    paint = true;
    ctx.beginPath();
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    ctx.moveTo(mouse.x, mouse.y);
  });

  container.mousemove(function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    if (paint == true) {
      if (paint_erase == "paint") {
        ctx.strokeStyle = $("#paintColor").val();
      } else {
        ctx.strokeStyle = "white";
      }
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });

  container.mouseup(function () {
    paint = false;
    saveState(); 
  });

  container.mouseleave(function () {
    if (paint) {
      paint = false;
      saveState(); 
    }
  });

  $("#reset").click(function () {
    //  First two are top-left points and second botton-right points
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paint_erase = "paint";
    $("#erase").removeClass("eraseMode");
  });

  $("#save").click(function () {
    if (typeof localStorage != null) {
      localStorage.setItem("imgCanvas", canvas.toDataURL());
    } else {
      window.alert("Your browser does not support local storage!");
    }
  });

  $("#erase").click(function () {
    if (paint_erase == "paint") {
      paint_erase = "erase";
    } else {
      paint_erase = "paint";
    }
    $(this).toggleClass("eraseMode");
  });

  $("#paintColor").change(function () {
    $("#circle").css("background-color", $(this).val());
  });

  $("#slider").slider({
    min: 3,
    max: 30,
    slide: function (event, ui) {
      $("#circle").height(ui.value);
      $("#circle").width(ui.value);
      ctx.lineWidth = ui.value;
    },
  });

  // Undo / Redo Functionality
  $("#undo").click(undo);
  $("#redo").click(redo);

});