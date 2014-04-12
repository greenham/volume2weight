var V2W = (function ($) {

  var app = {};

  app.densities       = [];
  app.ingredientNames = [];

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

  app.g_lb    = 453;
  app.g_oz    = 28;
  app.inputs  = {};
  app.buttons = {};

  app.firstResult = true;

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
    this.initData();

    this.inputs = {
      ingredient: $('input#ingredient'),
      amount:     $('input#amount'),
      unit:       $('select#unit')
    };

    this.buttons = {
      reset: $('button#reset-btn')
    };

    this.ingredientNames = _.map(this.densities, function (item) {
      return item.name;
    });

    this.inputs.ingredient.typeahead({
      source: this.ingredientNames,
      minLength: 2
    });

    this.inputs.ingredient.change($.proxy(this.doConversion, this));
    this.inputs.amount.change($.proxy(this.doConversion, this));
    this.inputs.unit.change($.proxy(this.doConversion, this));

    this.buttons.reset.click($.proxy(this.resetForm, this));

    this.inputs.ingredient.focus();
  };

  app.doConversion = function (e) {
    var $el        = $(e.currentTarget);
    var ingredient = this.inputs.ingredient.val();
    var amount     = this.inputs.amount.val();
    var unit       = this.inputs.unit.children(':selected').val();

    this.inputs.amount.tooltip('destroy').css('outline', 'none');
    this.inputs.ingredient.tooltip('destroy').css('outline', 'none');

    if (ingredient.length === 0 || amount.length === 0) {
      return false;
    }

    if ($.isNumeric(amount) === false || amount < 0) {
      // @todo show a tooltip
      this.inputs.amount.tooltip('hide')
                        .attr('data-original-title', "Enter a valid number.")
                        .tooltip('fixTitle')
                        .tooltip('show')
                        .css('outline', '1px solid red')
                        .focus();
      return false;
    }

    // find density for this ingredient
    var density = _.find(this.densities, function (item) {
      return item.name == ingredient;
    });

    if (density === undefined) {
      // @todo show a tooltip
      this.inputs.ingredient.tooltip('hide')
                            .attr('data-original-title', "No match found for '" + ingredient + "'")
                            .tooltip('fixTitle')
                            .tooltip('show')
                            .css('outline', '1px solid red')
                            .focus();
    }

    // do conversion based on units selected
    var grams;
    if (density.g_whole === null) {
      grams = amount * density.g_ml * this.unitConversions[unit];
    } else {
      grams = amount * density.g_whole;
      unit = "units";
    }

    if (grams !== null)
    {
      var gramsOutput = "";
      if (grams >= 1000) {
        kilos = (grams / 1000);
        gramsOutput = this.formatNumber(kilos.toFixed(2)) + " kg";
      } else {
        gramsOutput = this.formatNumber(grams.toFixed(2)) + " g";
      }
      var poundsOutput = this.formatNumber((grams / this.g_lb).toFixed(2)) + " lb";
      var ouncesOutput = this.formatNumber((grams / this.g_oz).toFixed(2)) + " oz";

      var $resultsRow = $el.parent().parent().siblings('tr.results-row');

      $resultsRow.children('td.grams').html(gramsOutput);
      $resultsRow.children('td.pounds').html(poundsOutput);
      $resultsRow.children('td.ounces').html(ouncesOutput);

      this.buttons.reset.show('fast');
      if (this.firstResult === true)
      {
        $resultsRow.show('fast');
        this.buttons.reset.focus();
      }
      this.firstResult = false;
    }
  };

  app.resetForm = function (e) {
    $el = $(e.currentTarget);
    $el.hide();
    $el.parent().parent('tr.results-row').hide();

    this.inputs.ingredient.val("");
    this.inputs.amount.val("");
    this.inputs.unit.val("c");

    this.inputs.ingredient.focus();

    this.firstResult = true;
  };

  app.formatNumber = function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return app;
})(jQuery);

$(function () {
  V2W.start();
});