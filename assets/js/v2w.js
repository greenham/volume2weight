var V2W = (function ($) {

  var app = {};

  app.densities       = [];
  app.ingredientNames = [];
  app.$table          = null;
  app.ingredientRows  = [];
  app.inputs          = {};
  app.buttons         = {};

  app.unitConversions = {
    "ml":   1,
    "dl":   100,
    "l":    1000,
    "t":    5,
    "T":    15,
    "floz": 29.6,
    "c":    237,
    "pt":   473,
    "qt":   946,
    "gal":  3785
  };

  app.g_lb = 453;
  app.g_oz = 28;

  app.templates = {
    measure:    _.template("<% print(formatNumber(num.toFixed(2))); %> <em><%= abbr %></em>"),
    inputRow:   _.template('<tr class="input-row">'+$('tbody tr.input-row').html()+'</tr>'),
    resultCell: _.template('<h4><%= amount %></h4>')
  };

  app.initData = function () {
    if (localStorage && localStorage.getItem('v2w-densities'))
    {
      this.densities = JSON.parse(localStorage.getItem('v2w-densities'));
      return true;
    }

    $.ajax({
      async:    false,
      url:      "server.php",
      type:     "POST",
      data:     {action: "initData"},
      dataType: "json",
      context:  this,
      success:  function (data)
      {
        if (data.status == 'success')
        {
          this.densities = data.data;
          if (localStorage) {
            localStorage.setItem('v2w-densities', JSON.stringify(this.densities));
          }
          return true;
        } else if (data.status == 'error') {
          console.error(data.message);
          return false;
        }
      }
    });

    return false;
  };

  app.start = function () {
    var started = this.initData();

    if (started === false) {
      // @todo handle this gracefully
    }

    this.ingredientNames = _.map(this.densities, function (item) {
      return item.name;
    });

    this.$table = $('#recipe-table tbody');

    // initialize the first row
    this.ingredientRows.push(this.initRow(this.$table.find('tr.input-row')));
  };

  app.initRow = function ($row) {
    var inputs = {
      amountInput:     $row.find('.amount-input'),
      unitInput:       $row.find('.unit-input'),
      ingredientInput: $row.find('.ingredient-input')
    };

    inputs.ingredientInput.typeahead({
      source: this.ingredientNames,
      minLength: 2
    });

    inputs.ingredientInput.change($.proxy(this.doConversion, this)).tooltip();
    inputs.amountInput.change($.proxy(this.doConversion, this)).tooltip().focus();
    inputs.unitInput.change($.proxy(this.doConversion, this)).tooltip();

    inputs.unitInput.keyup($.proxy(this.doConversion, this));

    inputs.amountInput.focus();

    return inputs;
  };

  app.doConversion = function (e) {
    if (e.type == "keyup" && e.keyCode != "38" && e.keyCode != "40") {
      return false;
    }

    var $el              = $(e.currentTarget)
      , $inputRow        = $el.parent().parent()
      , $amountInput     = $inputRow.find('.amount-input')
      , $unitInput       = $inputRow.find('.unit-input')
      , $ingredientInput = $inputRow.find('.ingredient-input')
      , $gramsCell       = $inputRow.find('.grams-result')
      , $poundsCell      = $inputRow.find('.pounds-result')
      , $ouncesCell      = $inputRow.find('.ounces-result');

    var ingredient   = $ingredientInput.val()
      , amount       = $amountInput.val()
      , selectedUnit = $unitInput.find('option:selected')
      , unit         = selectedUnit.val()
      , unitDesc     = selectedUnit.text()
      , firstResult  = ($gramsCell.html().length === 0);

    var grams, kilos, pounds, ounces;

    $amountInput.tooltip('destroy').css('outline', 'none');
    $ingredientInput.tooltip('destroy').css('outline', 'none');

    if (ingredient.length === 0) {
      return false;
    }

    if ($.isNumeric(amount) === false || amount < 0) {
      showValidationError($amountInput, "Enter a valid number.");
      return false;
    }

    if (unit === "oz" || unit === "lb") {
      // straight conversion, no density needed
      grams = amount * ((unit === "oz") ? this.g_oz : this.g_lb);
    } else {
      // find density for this ingredient
      var density = _.find(this.densities, function (item) {
        return item.name == ingredient;
      });

      if (density === undefined) {
        showValidationError($ingredientInput, "No ingredient matching '" + ingredient + "'")
      }

      // do conversion based on units selected
      if (density.g_whole === null) {
        grams = amount * density.g_ml * this.unitConversions[unit];
      } else {
        grams = amount * density.g_whole;
        unit = "units";
      }
    }

    if (grams !== null)
    {
      var gramsOutput = "";
      if (grams >= 1000)
      {
        kilos = (grams / 1000);
        gramsOutput = this.templates.measure({num: kilos, abbr: "kg"});
      } else {
        gramsOutput = this.templates.measure({num: grams, abbr: "g"});
      }

      pounds = grams / this.g_lb;
      ounces = grams / this.g_oz;

      var poundsOutput = this.templates.measure({num: pounds, abbr: "lb"})
        , ouncesOutput = this.templates.measure({num: ounces, abbr: "oz"});

      $gramsCell.html(this.templates.resultCell({amount: gramsOutput}));
      $poundsCell.html(this.templates.resultCell({amount: poundsOutput}));
      $ouncesCell.html(this.templates.resultCell({amount: ouncesOutput}));

      if (firstResult === true)
      {
        var $newRow = $(this.templates.inputRow());
        this.$table.prepend($newRow);
        this.ingredientRows.push(this.initRow($newRow));

        if (unit === "units") {
          $unitInput.val('');
        }
      }
    }
  };

  return app;
})(jQuery);

$(function () {
  V2W.start();
});

var formatNumber = function (num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var showValidationError = function (input, errorMsg) {
  input.tooltip('hide')
       .attr('data-original-title', errorMsg)
       .tooltip('fixTitle')
       .tooltip('show')
       .css('outline', '1px solid red')
       .focus();
};