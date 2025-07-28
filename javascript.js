$(function () {
  let paint = false;
  let paint_erase = "paint";

  const canvas = document.getElementById("paint");
  const ctx = canvas.getContext("2d");
  const container = $("#container");

  const mouse = { x: 0, y: 0 };
  // Undo / Redo Functionality
  let history = [];
  let step = -1;
  let hasDrawn = false;

  function saveState() {
    step++;
    if (step < history.length) history.length = step;
    history.push(canvas.toDataURL());
  }

  function undo() {
    if (step > 0) {
      step--;
      const img = new Image();
      img.src = history[step];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }

  function redo() {
    if (step < history.length - 1) {
      step++;
      const img = new Image();
      img.src = history[step];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }

  // Load from localStorage then save initial state
  if (localStorage.getItem("imgCanvas") != null) {
    const img = new Image();
    img.onload = function () { ctx.drawImage(img, 0, 0); saveState(); };
    img.src = localStorage.getItem("imgCanvas");
  } else {
    saveState(); // blank canvas state
  }

  // set drawing parameters
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  container.mousedown(function (e) {
    paint = true;
    hasDrawn = false;
    ctx.beginPath();
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    ctx.moveTo(mouse.x, mouse.y);
  });

  container.mousemove(function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    if (paint) {
      hasDrawn = true;
      ctx.strokeStyle = paint_erase === "paint" ? $("#paintColor").val() : "white";
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });

  container.mouseup(function () {
    paint = false;
    if (hasDrawn) saveState();
  });

  container.mouseleave(function () {
    if (paint && hasDrawn) {
      paint = false;
      saveState();
    }
  });

  $("#reset").click(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paint_erase = "paint";
    $("#erase").removeClass("eraseMode");
    saveState();
  });

  $("#save").click(function () {
    if (typeof localStorage != null) {
      localStorage.setItem("imgCanvas", canvas.toDataURL());
    } else {
      window.alert("Your browser does not support local storage!");
    }
  });

  $("#erase").click(function () {
    paint_erase = paint_erase === "paint" ? "erase" : "paint";
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
    }
  });

  // Undo / Redo
  $("#undo").click(undo);
  $("#redo").click(redo);

});
