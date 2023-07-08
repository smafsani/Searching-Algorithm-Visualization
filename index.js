$(document).ready(function () {
  // Number of Samples
  var select = $("#numberOfSample");

  var options = '';
  var _ = 5;
  while (_ * _ <= 400) {
    options += `<option value='${_ * _}'>${_ * _}</option>`;
    _ += 1;
  }
  select.append(options);

  // Algorithms
  var algorithm = $("#chooseAlgorithm");

  var options = '<option value="ls">Linear Search</option>';
  options += '<option value="bs">Binary Search</option>';
  options += '<option value="ts">Ternary Search</option>';
  options += '<option value="is">Interpolation Search</option>';
  options += '<option value="js">Jump Search</option>';
  options += '<option value="es">Exponential Search</option>';
  algorithm.append(options);


  // Time Intervals
  options = '';
  _ = 500;
  while (_ <= 2000) {
    options += `<option value='${_}'>${_}ms</option>`;
    _ += 500;
  }
  $("#timeInterval").append(options);

});

var COLORS = ["color1", "color2", "color3", "color4", "color5"];
var COLORS_SIZE = COLORS.length;
var MIN_RANGE = 1;
var MAX_RANGE = 999;
var SAMPLES_SIZE = 25;
var SAMPLES = [];
var COPY_SAMPLES = [];
var DIMENSION_SIZE = 5;
var TIME_INTERVAL = 500;

$(document).ready(function () {
  $("#generateNumber").click(function () {
    clearAll();
    SAMPLES = []
    $(".grid").html('');
    var NO_OF_SAMPLES = $("#numberOfSample").val();
    if (!NO_OF_SAMPLES) {
      return;
    }
    SAMPLES_SIZE = NO_OF_SAMPLES;
    DIMENSION_SIZE = parseInt(Math.sqrt(NO_OF_SAMPLES));
    $(".grid").css({
      'grid-template-columns': `repeat(${DIMENSION_SIZE}, 28px)`,
      'grid-template-rows': `repeat(${DIMENSION_SIZE}, 28px)`
    });
    while (SAMPLES.length < SAMPLES_SIZE) {
      var randomNumber = Math.floor(Math.random() * (MAX_RANGE - MIN_RANGE + 1)) + MIN_RANGE;
      if (!SAMPLES.includes(randomNumber)) {
        SAMPLES.push(randomNumber);
      }
    }
    COPY_SAMPLES = SAMPLES.slice();
    if ($("#chooseAlgorithm").val() && $("#chooseAlgorithm").val() != 'ls') {
      showCells(true);
    }
    else {
      showCells();
    }
  });

  $("#timeInterval").change(function(){
    TIME_INTERVAL = $("#timeInterval").val();
  });

  function showCells(sort = false) {
    $(".grid").html('');
    if (sort) {
      SAMPLES.sort(function (x, y) { return x - y; });
    }
    var grid = $('.grid');
    for (var row = 0; row < DIMENSION_SIZE; row++) {
      for (var col = 0; col < DIMENSION_SIZE; col++) {
        index = (row * DIMENSION_SIZE) + col;
        color = COLORS[(row + col) % COLORS_SIZE];
        var cell = $('<div>').addClass(`cell color1`).html(`${SAMPLES[index]}`);
        grid.append(cell);
      }
    }
  }

  function setResult(result) {
    if (result == -1) {
      $('#resultValue').html('<p class="not-found">Not Found</p>');

      $(".status-text").html('<span class="not-found" style="font-weight: bold;">Not Found</span>');
    }
    else {
      $("#resultValue").html(`<p class="found">Found At Index-${result}/Position-${result + 1}</p>`);
      $(`.cell:eq(${result})`).removeClass('color1');
      $(`.cell:eq(${result})`).addClass('cell-found');
      $(".index").html(`${result}`);
      $(".sear_val").html(`${$("#searchValue").val()}`);
      $(".curr_val").html(`${SAMPLES[result]}`);
      $(".status-text").html('<span class="found" style="font-weight: bold;">Found</span>');
    }
  }

  $("#chooseAlgorithm").change(function () {
    let choosenAlgorithm = $(this).val();
    if (choosenAlgorithm != 'ls') {
      showCells(true);
    }
    else {
      SAMPLES = COPY_SAMPLES.slice();
      showCells();
    }
  })

  function showAlert(sv, ca, nos){
    if(!sv){
      $("#searchValue").addClass('red-alert');
    }
    if(!ca){
      $("#chooseAlgorithm").addClass('red-alert');
    }
    if(!nos){
      $("#numberOfSample").addClass('red-alert');
    }
  }

  let PREV_CELL;
  let PREV_CELL2;
  let CURRENT_CELL;
  let timeoutIds = [];
  let timeOutId = null;
  $('#search').click(function () {
    clearAll();
    let search_value = $("#searchValue").val();
    $("#searchValue").removeClass('red-alert');
    $(".sear_val").html(`${$("#searchValue").val()}`);

    let choosenAlgorithm = $("#chooseAlgorithm").val();
    $("#chooseAlgorithm").removeClass('red-alert');

    $("#numberOfSample").removeClass('red-alert');
    if (!search_value || !choosenAlgorithm || !$("#numberOfSample").val()) {
      showAlert(search_value, choosenAlgorithm, $("#numberOfSample").val());
      return;
    }
    if (choosenAlgorithm != 'ls') {
      showCells(true);
    }

    $('#resultValue').html('<p class="searching">Searching...</p>');
    $(".status-text").html('<span class="searching" style="font-weight: bold;">Searching...</span>');
    let search_algorithm = new Search();
    if (choosenAlgorithm == 'ls') {
      search_algorithm.linear_search_algorithm(SAMPLES, search_value, function (result) {
        setResult(result);
      });
    }
    else if (choosenAlgorithm == 'bs') {
      search_algorithm.binary_search_algorithm(SAMPLES, search_value, 0, SAMPLES_SIZE - 1, function (result) {
        setResult(result);
      });
    }
    else if (choosenAlgorithm == 'ts') {
      search_algorithm.ternary_search_algorithm(SAMPLES, search_value, 0, SAMPLES_SIZE - 1, function (result) {
        // console.log(result);
        setResult(result);
      });
    }
    else if (choosenAlgorithm == 'is') {
      search_algorithm.interpolation_search_algorithm(SAMPLES, search_value, function (result) {
        // console.log(result);
        setResult(result);
      });
    }
    else if (choosenAlgorithm == 'js') {
      search_algorithm.jump_search_algorithm(SAMPLES, search_value, SAMPLES_SIZE, function (result) {
        // console.log(result);
        setResult(result);
      });
    }
    else if (choosenAlgorithm == 'es') {
      search_algorithm.exponential_search_algorithm(SAMPLES, search_value, function (result) {
        // console.log(result);
        setResult(result);
      });
    }


  });

  function clearAll() {
    $('#resultValue').html('');
    $(".index").html('');
    $(".curr_val").html('');
    $(".sear_val").html('');
    $(".status-text").html('');
    for (let i = 0; i < timeoutIds.length; i++) {
      clearTimeout(timeoutIds[i]);
    }
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = null;
    timeoutIds = [];
    $(`.cell`).removeClass('current');
    $(`.cell`).removeClass('cell-found');
    $(`.cell`).addClass('color1');
    PREV_CELL = null;
    PREV_CELL2 = null;
    CURRENT_CELL = null;
  }
  function setCells(arr, val){
    $(`.cell:eq(${val})`).removeClass('color1');
    $(`.cell:eq(${val})`).addClass('current');
    CURRENT_CELL = val;
    PREV_CELL = val;
    $(".index").html(`${val}`);
    $(".curr_val").html(`${arr[val]}`);

  }
  const NOT_FOUND = -1;
  class Search {
    linear_search_algorithm(arr, search_value, callback) {
      arr.forEach(function (value, index) {
        let timeoutId = setTimeout(function () {
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, index);
          // $(`.cell:eq(${index})`).removeClass('color1');
          // $(`.cell:eq(${index})`).addClass('current');
          // CURRENT_CELL = index;
          // PREV_CELL = index;
          // $(".index").html(`${index}`);
          // $(".curr_val").html(`${value}`);
          if (value == search_value) {
            clearAll();
            callback(index);
          }
          else if (index == SAMPLES_SIZE - 1) {
            callback(NOT_FOUND);
          }
        }, index * TIME_INTERVAL);

        timeoutIds.push(timeoutId);
      });
    }

    binary_search_algorithm(arr, search_value, left, right, callback) {
      function searchIteration() {
        if (left <= right) {
          let mid = parseInt((left + right) / 2);
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, mid);
          // $(`.cell:eq(${mid})`).removeClass('color1');
          // $(`.cell:eq(${mid})`).addClass('current');
          // CURRENT_CELL = mid;
          // PREV_CELL = mid;
          // $(".index").html(`${mid}`);
          // $(".curr_val").html(`${arr[mid]}`);

          if (arr[mid] == search_value) {
            clearAll();
            callback(mid);
            return;
          } else if (arr[mid] < search_value) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
          timeOutId = setTimeout(searchIteration, TIME_INTERVAL);
        }
        else {
          callback(NOT_FOUND);
          return;
        }
      }
      searchIteration();
    }

    ternary_search_algorithm(arr, search_value, left, right, callback) {
      function searchIteration() {
        if (right >= left) {
          const mid = left + Math.floor((right - left) / 3);
          const mid1 = right - Math.floor((right - left) / 3);

          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          if (PREV_CELL2 >= 0) {
            $(`.cell:eq(${PREV_CELL2})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL2})`).addClass('color1');
          }
          $(`.cell:eq(${mid})`).removeClass('color1');
          $(`.cell:eq(${mid})`).addClass('current');
          $(`.cell:eq(${mid1})`).removeClass('color1');
          $(`.cell:eq(${mid1})`).addClass('current');
          CURRENT_CELL = mid;
          PREV_CELL = mid;
          PREV_CELL2 = mid1;
          $(".index").html(`${mid} & ${mid1}`);
          $(".curr_val").html(`${arr[mid]} & ${arr[mid1]}`);

          if (arr[mid] == search_value) {
            clearAll();
            callback(mid);
            return;
          }
          if (arr[mid1] == search_value) {
            clearAll();
            callback(mid1);
            return;
          }
          if (arr[mid] > search_value) {
            right = mid - 1;
          } else if (arr[mid1] < search_value) {
            left = mid1 + 1;
          } else {
            left = mid + 1;
            right = mid1 - 1;
          }
          timeOutId = setTimeout(searchIteration, TIME_INTERVAL);
        } else {
          callback(NOT_FOUND);
          return;
        }
      }

      searchIteration()

    }

    interpolation_search_algorithm(arr, search_value, callback) {
      let low = 0;
      let high = arr.length - 1;
      function searchIteration() {
        if (low <= high) {
          const pos = low + Math.floor(((search_value - arr[low]) * (high - low)) / (arr[high] - arr[low]));

          if (arr[low] > search_value || arr[high] < search_value) {
            callback(NOT_FOUND);
            return;
          }

          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, pos);
          // $(`.cell:eq(${pos})`).removeClass('color1');
          // $(`.cell:eq(${pos})`).addClass('current');
          // CURRENT_CELL = pos;
          // PREV_CELL = pos;
          // $(".index").html(`${pos}`);
          // $(".curr_val").html(`${arr[pos]}`);

          if (arr[pos] == search_value) {
            clearAll();
            callback(pos);
            return;
          } else if (arr[pos] < search_value) {
            low = pos + 1;
          } else {
            high = pos - 1;
          }
          timeOutId = setTimeout(searchIteration, TIME_INTERVAL);
        }
        else {
          callback(NOT_FOUND);
          return;
        }
      }
      searchIteration();
    }

    jump_search_algorithm(arr, search_value, n, callback) {
      const step = Math.floor(Math.sqrt(n));
      let current_step = step;
      let prev = 0;
      PREV_CELL = 0;      
      setCells(arr, prev);
      let foundRange = 1;
      function findPossibleRange() {
        if (arr[Math.min(current_step, n) - 1] < search_value) {
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, current_step);
          PREV_CELL = current_step;
          prev = current_step;
          current_step += step;

          if (prev >= n) {
            foundRange = 1;
            callback(NOT_FOUND);
            return;
          }
          timeOutId = setTimeout(findPossibleRange, TIME_INTERVAL);
        }
        else{
          traceValue();
        }
      }
      function traceValue(){
        if(arr[prev] < search_value){
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, prev);
          PREV_CELL = prev;
          prev += 1;
          timeOutId = setTimeout(traceValue, TIME_INTERVAL);
        }
        else if(arr[prev] == search_value){
          clearAll();
          callback(prev);
          return;
        }
        else{
          callback(NOT_FOUND);
          return;
        }
      }
      setTimeout(findPossibleRange, TIME_INTERVAL);
    }

    exponential_search_algorithm(arr, search_value, callback) {
      const n = arr.length;
      PREV_CELL = 0;
      setCells(arr, 0);

      if (arr[0] === search_value) {
        clearAll()
        callback(0);
        return;
      }

      let i = 1;
      const searchIteration = () => {
        if (i < n && arr[i] <= search_value) {
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, i);
          PREV_CELL = i;
          i *= 2;
          timeOutId = setTimeout(searchIteration, TIME_INTERVAL);
        }
        else{
          if (PREV_CELL >= 0) {
            $(`.cell:eq(${PREV_CELL})`).removeClass('current');
            $(`.cell:eq(${PREV_CELL})`).addClass('color1');
          }
          setCells(arr, Math.min(i, n-1));
          setTimeout(() => {
            return this.binary_search_algorithm(arr, search_value, i / 2, Math.min(i, n - 1), callback);
          }, TIME_INTERVAL);
        }
      }
      searchIteration();
    }
  }
});
