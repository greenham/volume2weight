var V2W = (function ($) {

  var app = {};

  app.densities       = [];
  app.ingredientNames = [];
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

  app.firstResult = true;

  app.templates = {
    measure:    _.template("<% print(formatNumber(num.toFixed(2))); %> <em><%= abbr %></em>"),
    resultCell: _.template('<span class="ingredient"><strong><%= amount %> <%= units %></strong> of <em><%= ingredient %></em> = </span><span class="grams label label-info"><%= grams %></span><span class="pounds label label-warning"><%= pounds %></span><span class="ounces label label-danger"><%= ounces %></span><button class="btn btn-xs btn-default" id="reset-btn"><span class="glyphicon glyphicon-remove-circle"></span></button>')
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

    this.inputs = {
      ingredient: $('input#ingredient'),
      amount:     $('input#amount'),
      unit:       $('select#unit')
    };

    this.ingredientNames = _.map(this.densities, function (item) {
      return item.name;
    });

    this.inputs.ingredient.typeahead({
      source: this.ingredientNames,
      minLength: 2
    });

    this.inputs.ingredient.change($.proxy(this.doConversion, this)).tooltip().focus();
    this.inputs.amount.change($.proxy(this.doConversion, this)).tooltip();
    this.inputs.unit.change($.proxy(this.doConversion, this)).tooltip();

    /*this.inputs.unit.keyup(function (e) {
      if (e.keyCode == '38' || e.keyCode == '40') {
        $.proxy(this.doConversion, this);
      }
    });*/
  };

  app.doConversion = function (e) {
    var $el        = $(e.currentTarget);
    var ingredient = this.inputs.ingredient.val();
    var amount     = this.inputs.amount.val();

    var selectedUnit = this.inputs.unit.find('option:selected');
    var unit         = selectedUnit.val();
    var unitDesc     = selectedUnit.text();

    var grams, kilos, pounds, ounces;

    this.inputs.amount.tooltip('destroy').css('outline', 'none');
    this.inputs.ingredient.tooltip('destroy').css('outline', 'none');

    if (ingredient.length === 0 || amount.length === 0) {
      return false;
    }

    if ($.isNumeric(amount) === false || amount < 0) {
      this.inputs.amount.tooltip('hide')
                        .attr('data-original-title', "Enter a valid number.")
                        .tooltip('fixTitle')
                        .tooltip('show')
                        .css('outline', '1px solid red')
                        .focus();
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
        this.inputs.ingredient.tooltip('hide')
                              .attr('data-original-title', "No ingredient matching '" + ingredient + "'")
                              .tooltip('fixTitle')
                              .tooltip('show')
                              .css('outline', '1px solid red')
                              .focus();
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
      if (grams >= 1000) {
        kilos = (grams / 1000);
        gramsOutput = this.templates.measure({num: kilos, abbr: "kg"});
      } else {
        gramsOutput = this.templates.measure({num: grams, abbr: "g"});
      }

      pounds = grams / this.g_lb;
      ounces = grams / this.g_oz;

      var poundsOutput = this.templates.measure({num: pounds, abbr: "lb"});
      var ouncesOutput = this.templates.measure({num: ounces, abbr: "oz"});

      var $resultsRow = $el.parent().parent().siblings('tr.results-row');
      var $resultsCell = $resultsRow.children('td.conversion-result');

      $resultsCell.html(this.templates.resultCell({
        amount:     amount,
        units:      ((amount == 1) ? unitDesc.slice(0, unitDesc.length-1) : unitDesc),
        ingredient: ingredient,
        grams:      gramsOutput,
        pounds:     poundsOutput,
        ounces:     ouncesOutput
      }));

      this.buttons.reset = $('button#reset-btn');
      this.buttons.reset.on('click', $.proxy(this.resetForm, this)).show('fast');

      if (this.firstResult === true) {
        $resultsRow.show('fast');
      }
      this.firstResult = false;
    }
  };

  app.resetForm = function (e) {
    $el = $(e.currentTarget);
    $el.hide()
       .parents('tr.results-row').hide();

    this.inputs.ingredient.val("");
    this.inputs.amount.val("");
    this.inputs.unit.val("c");

    this.inputs.ingredient.focus();

    this.firstResult = true;
  };

  return app;
})(jQuery);

$(function () {
  V2W.start();
});

var formatNumber = function (num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};