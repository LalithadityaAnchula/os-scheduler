class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    var qElement = new QElement(element, priority);
    var contain = false;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.items.push(qElement);
    }
  }
  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }
  front() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }
  isEmpty() {
    return this.items.length == 0;
  }
}
$(document).ready(function () {
  $(".dynamic").hide();
  $("#chooseAlgo").val("FCFS");
  $("#burstTimes").val("");
  $("#arrivalTimes").val("");
});

$("#chooseAlgo").change(function () {
  let chosenAlgorithm = $("#chooseAlgo").find(":selected").text();
  if (chosenAlgorithm == "Priority Scheduling") {
    var $div = $(
      '<div class="field" id="priorityInput"><label class="label">Priorities</label><div class="control"><input class="input"  id="priorities" type="text" placeholder="Text input"></div></div>'
    );
    $("#inputSection").append($div);
  }
  if (chosenAlgorithm == "Round Robin") {
    var $div = $(
      '<div class="field" id="timeQuantaInput"><label class="label">Time Quantum</label><div class="control"><input class="input" id="timeQuantum" type="Number" placeholder="4 Seconds"></div></div>'
    );
    $("#inputSection").append($div);
  }
  if (chosenAlgorithm != "Round Robin") {
    $("#timeQuantaInput").fadeOut("normal", function () {
      $(this).remove();
    });
  }
  if (chosenAlgorithm != "Priority Scheduling") {
    $("#priorityInput").fadeOut("normal", function () {
      $(this).remove();
    });
  }
  cleartable();
});

function check(arr) {
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === NaN || isNaN(arr[i])) {
      return true;
    }
  }
  return false;
}

$("#resultButton").on("click", () => {
  cleartable();
  let arrivalTimes = $("#arrivalTimes").val();
  let burstTimes = $("#burstTimes").val();
  let arrivalTimesArray = arrivalTimes.split(" ").map(function (item) {
    return parseInt(item, 10);
  });
  var burstTimesArray = burstTimes.split(" ").map(function (item) {
    return parseInt(item, 10);
  });

  if (arrivalTimesArray.length != burstTimesArray.length) {
    alert("Sizes of burstTimesArray and arrivalTimesArray not matching");
    return;
  }

  if (check(arrivalTimesArray) || check(burstTimesArray)) {
    alert("Please enter valid inputs !");
    return;
  }

  let chosenAlgorithm = $("#chooseAlgo").find(":selected").text();
  if (chosenAlgorithm === "FCFS") {
    fcfs(arrivalTimesArray, burstTimesArray);
  } else if (chosenAlgorithm === "SJF") {
    sjf(arrivalTimesArray, burstTimesArray);
  } else if (chosenAlgorithm === "LJF") {
    ljf(arrivalTimesArray, burstTimesArray);
  } else if (chosenAlgorithm === "Priority Scheduling") {
    let priorities = $("#priorities").val();
    let prioritiesArray = arrivalTimes.split(" ").map(function (item) {
      return parseInt(item, 10);
    });
    ps(arrivalTimesArray, burstTimesArray, prioritiesArray);
  } else if (chosenAlgorithm === "Round Robin") {
    let tc = $("#timeQuantum").val();
    console.log(tc);
    rr(arrivalTimesArray, burstTimesArray, tc);
  }
});

function fcfs(at, bt) {
  var gant = [];
  var current_time = 0;
  var li = [];
  for (var i = 0; i < at.length; i++) {
    li.push({
      key: i + 1,
      val: [at[i], bt[i]],
    });
  }
  li.sort(function (a, b) {
    return a.val[0] - b.val[0];
  });
  for (var i = 0; i < at.length; i++) {
    if (current_time < li[i].val[0]) {
      current_time = li[i].val[0];
      gant.push([-1, current_time]);
    }
    current_time += li[i].val[1];
    gant.push([li[i].key, current_time]);

    li[i].val.push(current_time);
    li[i].val.push(current_time - li[i].val[0]);
    li[i].val.push(li[i].val[3] - li[i].val[1]);
  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(li);
}

function sjf(at, bt) {
  var pq = new PriorityQueue();

  var gant = [];
  var current_time = 0;

  var li = [];
  var ans = [];
  for (var i = 0; i < at.length; i++) {
    li.push({
      key: i + 1,
      val: [at[i], bt[i]],
    });
  }

  li.sort(function (a, b) {
    return a.val[0] - b.val[0];
  });

  for (var i = 0; i < at.length; i++) {
    if (pq.isEmpty()) {
      if (current_time < li[i].val[0]) {
        current_time = li[i].val[0];
        gant.push([-1, current_time]);
      }
    }
    while (!pq.isEmpty() && current_time < li[i].val[0]) {
      var p = pq.front().element;
      if (current_time < p[0]) {
        current_time = p[0];
        gant.push([-1, current_time]);
      }
      current_time += p[1];
      gant.push([p[2], current_time]);
      ans.push({
        key: p[2],
        val: [
          p[0],
          p[1],
          current_time,
          current_time - p[0],
          current_time - p[0] - p[1],
        ],
      });
      pq.dequeue();
    }

    pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], bt[i]);
  }

  while (!pq.isEmpty()) {
    var p = pq.front().element;
    if (current_time < p[0]) {
      current_time = p[0];
      gant.push(-1, current_time);
    }
    current_time += p[1];
    gant.push([p[2], current_time]);
    ans.push({
      key: p[2],
      val: [
        p[0],
        p[1],
        current_time,
        current_time - p[0],
        current_time - p[0] - p[1],
      ],
    });

    pq.dequeue();
  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(ans);
}

function ljf(at, bt) {
  var pq = new PriorityQueue();
  var gant = [];
  var current_time = 0;

  var li = [];
  var ans = [];
  for (var i = 0; i < at.length; i++) {
    li.push({
      key: i + 1,
      val: [at[i], bt[i]],
    });
  }

  li.sort(function (a, b) {
    return a.val[0] - b.val[0];
  });

  for (var i = 0; i < at.length; i++) {
    if (pq.isEmpty()) {
      if (current_time < li[i].val[0]) {
        current_time = li[i].val[0];
        gant.push([-1, current_time]);
      }
    }
    while (!pq.isEmpty() && current_time < li[i].val[0]) {
      var p = pq.front().element;
      if (current_time < p[0]) {
        current_time = p[0];
        gant.push([-1, current_time]);
      }
      current_time += p[1];
      gant.push([p[2], current_time]);
      ans.push({
        key: p[2],
        val: [
          p[0],
          p[1],
          current_time,
          current_time - p[0],
          current_time - p[0] - p[1],
        ],
      });
      pq.dequeue();
    }
    pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], -bt[i]);
  }

  while (!pq.isEmpty()) {
    var p = pq.front().element;
    if (current_time < p[0]) {
      current_time = p[0];
      gant.push(-1, current_time);
    }
    current_time += p[1];
    gant.push([p[2], current_time]);
    ans.push({
      key: p[2],
      val: [
        p[0],
        p[1],
        current_time,
        current_time - p[0],
        current_time - p[0] - p[1],
      ],
    });
    pq.dequeue();
  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(ans);
}

function ps(at, bt, pt) {
  var pq = new PriorityQueue();
  var gant = [];
  var current_time = 0;

  var li = [];
  var ans = [];
  for (var i = 0; i < at.length; i++) {
    li.push({
      key: i + 1,
      val: [at[i], bt[i], pt[i]],
    });
  }

  li.sort(function (a, b) {
    return a.val[0] - b.val[0];
  });

  for (var i = 0; i < at.length; i++) {
    if (pq.isEmpty()) {
      if (current_time < li[i].val[0]) {
        current_time = li[i].val[0];
        gant.push([-1, current_time]);
      }
    }
    while (!pq.isEmpty() && current_time < li[i].val[0]) {
      var p = pq.front().element;
      if (current_time < p[0]) {
        current_time = p[0];
        gant.push([-1, current_time]);
      }
      current_time += p[1];
      gant.push([p[2], current_time]);
      ans.push({
        key: p[2],
        val: [
          p[0],
          p[1],
          current_time,
          current_time - p[0],
          current_time - p[0] - p[1],
        ],
      });

      pq.dequeue();
    }

    pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], li[i].val[2]);
  }

  while (!pq.isEmpty()) {
    var p = pq.front().element;
    if (current_time < p[0]) {
      current_time = p[0];
      gant.push(-1, current_time);
    }
    current_time += p[1];
    gant.push([p[2], current_time]);
    ans.push({
      key: p[2],
      val: [
        p[0],
        p[1],
        current_time,
        current_time - p[0],
        current_time - p[0] - p[1],
      ],
    });
    pq.dequeue();
  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(ans);
}

function rr(at, bt, tq) {
  tq = parseInt(tq);
  var gant = [];
  var li = []; //key = ID , val = Arrival time -> 0 , burst  ->1  ,rem_burst ->2,ft-3
  var ans = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
  var current_time = 0;
  for (var i = 0; i < at.length; i++) {
      li.push({
          key: (i + 1),
          val: [at[i], bt[i], bt[i]]
      })
  }

  li.sort(function (a, b) {
      return a.val[0] - b.val[0];
  });
  var finish_count = 0;

  while (1) {
      var none = true;
      if (finish_count < at.length) {
          var i;
          for (i = 0; i < at.length; i++) {
              if (li[i].val[0] <= current_time && li[i].val[2] > 0) {
                  none = false;
                  if (li[i].val[2] > tq) {
                      li[i].val[2] -= tq;
                      current_time += tq;
                      gant.push([li[i].key, current_time]);
                  } else if (li[i].val[2] === tq) {
                      li[i].val[2] = 0;
                      current_time += tq;
                      finish_count++;
                      gant.push([li[i].key, current_time]);
                      li[i].val.push(current_time);
                  } else {
                      current_time += li[i].val[2];
                      li[i].val[2] = 0;
                      finish_count++;
                      gant.push([li[i].key, current_time]);
                      li[i].val.push(current_time);
                  }
              } else {
                  if (li[i].val[0] > current_time) {
                      break;
                  }
              }

          }
          if (none) {
              current_time = li[i].val[0];
              gant.push([-1, current_time]);
          }
      } else {
          break;
      }
  }
  console.log(li);

  for (var i = 0; i < li.length; i++) {
      ans.push({
          key: (i + 1),
          val: [li[i].val[0], li[i].val[1], li[i].val[3], li[i].val[3] - li[i].val[0], li[i].val[3] - li[i].val[0] - li[i].val[1]]
      })

  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(ans);
}

function creategant(gant) {
  var gant_table = document.querySelector("#gant_table");
  var tr = document.createElement("TR");
  var tr2 = document.createElement("TR");
  var th = document.createElement("TH");
  var th2 = document.createElement("TH");

  th.innerHTML = "Time";
  th2.innerHTML = "PID";

  tr.appendChild(th);
  tr2.appendChild(th2);

  var temp = 0;

  for (var i = 0; i < gant.length; i++) {
    var td = document.createElement("TD");
    var td2 = document.createElement("TD");
    td.innerHTML = `${temp} -> ${gant[i][1]}`;
    temp = gant[i][1];
    tr.appendChild(td);
    td2.innerHTML = `${gant[i][0]}`;
    if (gant[i][0] === -1) {
      td2.innerHTML = "";
      td2.className = `has-background-danger-light`;
    } else {
      td2.className = `has-background-success-light`;
    }
    tr2.appendChild(td2);
  }
  $(".dynamic").show();
  creategant(gant);
  createtable();
  insertintotable(ans);
}

function creategant(gant) {
  var gant_table = document.querySelector("#gantt_table");
  var tr = document.createElement("TR");
  var tr2 = document.createElement("TR");
  var th = document.createElement("TH");
  var th2 = document.createElement("TH");

  th.innerHTML = "Time";
  th2.innerHTML = "PID";

  tr.appendChild(th);
  tr2.appendChild(th2);

  var temp = 0;

  for (var i = 0; i < gant.length; i++) {
    var td = document.createElement("TD");
    var td2 = document.createElement("TD");
    td.innerHTML = `${temp} -> ${gant[i][1]}`;
    temp = gant[i][1];
    tr.appendChild(td);
    td2.innerHTML = `${gant[i][0]}`;
    if (gant[i][0] === -1) {
      td2.innerHTML = "";
      td2.className = `has-background-danger-light`;
    } else {
      td2.className = `has-background-success-light`;
    }
    tr2.appendChild(td2);
  }

  gant_table.appendChild(tr);
  gant_table.appendChild(tr2);
}

function createtable() {
  var table = document.querySelector("#output_table");
  table.innerHTML = `
  <table>
  <thead >
      <tr >
      <th > PID </th>
      <th > Arrival Time </th>
      <th > Burst Time </th>
      <th > Finish Time </th>
      <th > Turnaround Time </th>
      <th > Waiting Time </th>
      </tr> </thead>
      </table>`;
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}

function insertintotable(li) {
  var table = document.querySelector("#output_table");
  var TAT_SUM = 0;
  var WT_SUM = 0;

  li.sort(function (a, b) {
    return a.key - b.key;
  });

  for (var i = 0; i < li.length; i++) {
    var tr = document.createElement("TR");
    var td = document.createElement("TD");
    td.innerHTML = li[i].key;
    tr.appendChild(td);
    for (var j = 0; j < 5; j++) {
      var td = document.createElement("TD");
      td.innerHTML = li[i].val[j];
      tr.appendChild(td);
    }
    table.appendChild(tr);

    TAT_SUM += li[i].val[3];
    WT_SUM += li[i].val[4];
  }

  var tf = document.createElement("tfoot");
  var tr = document.createElement("TR");
  var avg = document.createElement("TH");

  avg.innerHTML = "Average";
  avg.colSpan = 4;
  tr.appendChild(avg);

  var avg_tat = document.createElement("TH");
  var avg_wt = document.createElement("TH");

  avg_tat.innerHTML = TAT_SUM / li.length;
  avg_wt.innerHTML = WT_SUM / li.length;

  tr.appendChild(avg_tat);
  tr.appendChild(avg_wt);

  tf.appendChild(tr);
  table.appendChild(tf);
}

function cleartable() {
  $(".dynamic").hide();
  var table = document.querySelector("#output_table");
  table.innerHTML = "";
  var table2 = document.querySelector("#gantt_table");
  table2.innerHTML = "";
}
