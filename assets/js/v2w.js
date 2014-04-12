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

    if (ingredient.length === 0 || amount.length === 0) {
      return false;
    }

    // find density for this ingredient
    var density = _.find(this.densities, function (item) {
      return item.name == ingredient;
    });

    if (density === undefined) {
      alert("No match found for '"+ingredient+"'");
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
      var pounds = grams / this.g_lb;
      var ounces = grams / this.g_oz;

      $el.parent().siblings('td.grams').html(grams.toFixed(2) + " g");
      $el.parent().siblings('td.pounds').html(pounds.toFixed(2) + " lb");
      $el.parent().siblings('td.ounces').html(ounces.toFixed(2) + " oz");

      this.buttons.reset.show('fast');
    }
  };

  app.resetForm = function (e) {
    $el = $(e.currentTarget);
    $el.hide();
    $el.parent().siblings('td.conversion-result').html("");

    this.inputs.ingredient.val("");
    this.inputs.amount.val("");
    this.inputs.unit.val("c");

    this.inputs.ingredient.focus();
  };

  return app;
})(jQuery);

$(function () {
  V2W.start();
});