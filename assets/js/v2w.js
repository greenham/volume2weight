var V2W = {

  densities: [],

  ingredientNames: [],

  unitConversions: {
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
  },

  g_lb: 453,

  form: {
    inputs: {
      ingredient: $('input#ingredient'),
      amount:     $('input#amount'),
      unit:       $('select#unit')
    },
    buttons: {
      reset: $('button#reset-btn')
    }
  },

  initData: function () {
    if (localStorage && localStorage.getItem('v2w-densities')) {
      this.densities = JSON.parse(localStorage.getItem('v2w-densities'));
      return true;
    }

    $.ajax({
      async: false,
      url: "server.php",
      type: "POST",
      data: {action: "initData"},
      success: function (data)
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
      },
      dataType: 'json',
      context: this
    });

    return false;
  },

  startApp: function () {
    this.initData();

    this.ingredientNames = _.map(this.densities, function (item) {
      return item.name;
    });

    this.form.inputs.ingredient.typeahead({
      source: this.ingredientNames,
      minLength: 2
    });

    this.form.inputs.ingredient.change(doConversion);
    this.form.inputs.amount.change(doConversion);
    this.form.inputs.unit.change(doConversion);

    this.form.buttons.reset.click(function (e) {
      $(this).parent().siblings('td.grams,td.pounds').html("");
      this.form.inputs.ingredient.val("");
      this.form.inputs.amount.val("");
      $(this).hide();
      this.form.inputs.ingredient.focus();
    });

    this.form.inputs.ingredient.focus();
  },

  doConversion: function (e) {
    var $el = $(this);
    var ingredient = this.form.inputs.ingredient.val();
    var amount = this.form.inputs.amount.val();
    var unit = this.form.inputs.unit.children(':selected').val();

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
      grams = amount * density.g_ml * unitConversions[unit];
    } else {
      grams = amount * density.g_whole;
      unit = "units";
    }

    if (grams !== null)
    {
      var pounds = grams / g_lb;
      $el.parent().siblings('td.grams').html(grams.toFixed(2) + "g");
      $el.parent().siblings('td.pounds').html(pounds.toFixed(2) + "lb");
      this.form.buttons.reset.show('fast');
    }
  }
};

$(function(V2W) {


  if (densities.length > 0) {
    startApp(densities);
  } else {
    // @todo handle gracefully
  }
})(V2W);