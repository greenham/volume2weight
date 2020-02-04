let utils = {};

utils.formatNumber = function(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

utils.showValidationError = function(input, errorMsg) {
  input
    .tooltip("hide")
    .attr("data-original-title", errorMsg)
    .tooltip("fixTitle")
    .tooltip("show")
    .css("outline", "1px solid red")
    .focus();
};

const V2W = (function($, utils) {
  const { formatNumber, showValidationError } = utils;
  let app = {};

  app.densities = [];
  app.ingredientNames = [];
  app.$table = null;
  app.ingredientRows = [];
  app.inputs = {};
  app.buttons = {};

  app.unitConversions = {
    ml: 1,
    dl: 100,
    l: 1000,
    t: 5,
    T: 15,
    floz: 29.6,
    c: 237,
    pt: 473,
    qt: 946,
    gal: 3785
  };

  app.g_lb = 453;
  app.g_oz = 28;

  app.templates = {
    measure: _.template(
      //"<% print(formatNumber(num.toFixed(2))); %> <em><%= abbr %></em>"
      "<% print(num.toFixed(2)); %> <em><%= abbr %></em>"
    ),
    inputRow: _.template(
      '<tr class="input-row">' + $("tbody tr.input-row").html() + "</tr>"
    ),
    resultCell: _.template("<h3><%= amount %></h3>")
  };

  app.start = function() {
    $.getJSON("assets/js/densities.json", this.parseDensityData.bind(this));
  };

  app.parseDensityData = function(densities) {
    this.densities = densities;

    this.ingredientNames = _.map(this.densities, function(item) {
      return item.name;
    });

    this.$table = $("#recipe-table tbody");

    // initialize the first row
    this.ingredientRows.push(this.initRow(this.$table.find("tr.input-row")));
  };

  app.initRow = function($row) {
    var inputs = {
      amountInput: $row.find(".amount-input"),
      unitInput: $row.find(".unit-input"),
      ingredientInput: $row.find(".ingredient-input")
    };

    var $removeBtn = $row.find(".remove-ingredient");

    inputs.ingredientInput.typeahead({
      source: this.ingredientNames,
      minLength: 2
    });

    inputs.ingredientInput.change($.proxy(this.doConversion, this)).tooltip();
    inputs.amountInput
      .change($.proxy(this.doConversion, this))
      .tooltip()
      .focus();
    inputs.unitInput.change($.proxy(this.doConversion, this)).tooltip();

    inputs.unitInput.keyup($.proxy(this.doConversion, this));

    // handle row deletions
    $removeBtn.click(function(e) {
      let $btn = $(e.currentTarget);
      $row = $btn.parents(".input-row");
      app.removeRow($row);
    });

    inputs.amountInput.focus();

    return inputs;
  };

  app.removeRow = function($row) {
    $row.fadeOut("fast").remove();
  };

  app.doConversion = function(e) {
    if (e.type == "keyup" && e.keyCode != "38" && e.keyCode != "40") {
      return false;
    }

    var $el = $(e.currentTarget),
      $inputRow = $el.parents(".input-row"),
      $amountInput = $inputRow.find(".amount-input"),
      $unitInput = $inputRow.find(".unit-input"),
      $ingredientInput = $inputRow.find(".ingredient-input"),
      $gramsCell = $inputRow.find(".grams-result"),
      $poundsCell = $inputRow.find(".pounds-result"),
      $ouncesCell = $inputRow.find(".ounces-result");

    var ingredient = $ingredientInput.val(),
      amount = $amountInput.val(),
      selectedUnit = $unitInput.find("option:selected"),
      unit = selectedUnit.val(),
      unitDesc = selectedUnit.text(),
      firstResult = $gramsCell.html().length === 0;

    var grams, kilos, pounds, ounces;

    $amountInput.tooltip("destroy").css("outline", "none");
    $ingredientInput.tooltip("destroy").css("outline", "none");

    if (
      firstResult === false &&
      ingredient.length === 0 &&
      amount.length === 0
    ) {
      // @todo whack this row?
    }

    if (ingredient.length === 0) {
      return false;
    }

    if ($.isNumeric(amount) === false || amount < 0) {
      showValidationError($amountInput, "Enter a valid number.");
      return false;
    }

    if (unit === "oz" || unit === "lb") {
      // straight conversion, no density needed
      grams = amount * (unit === "oz" ? this.g_oz : this.g_lb);
    } else {
      // find density for this ingredient
      var density = _.find(this.densities, function(item) {
        return item.name == ingredient;
      });

      if (typeof density === "undefined") {
        showValidationError(
          $ingredientInput,
          "No ingredient matching '" + ingredient + "'"
        );
        return false;
      }

      // do conversion based on units selected
      if (density.g_whole === null) {
        grams = amount * density.g_ml * this.unitConversions[unit];
      } else {
        grams = amount * density.g_whole;
        unit = "units";
      }
    }

    if (grams !== null) {
      var gramsOutput = "";
      if (grams >= 1000) {
        kilos = grams / 1000;
        gramsOutput = this.templates.measure({ num: kilos, abbr: "kg" });
      } else {
        gramsOutput = this.templates.measure({ num: grams, abbr: "g" });
      }

      pounds = grams / this.g_lb;
      ounces = grams / this.g_oz;

      var poundsOutput = this.templates.measure({ num: pounds, abbr: "lb" }),
        ouncesOutput = this.templates.measure({ num: ounces, abbr: "oz" });

      $gramsCell.html(this.templates.resultCell({ amount: gramsOutput }));
      $poundsCell.html(this.templates.resultCell({ amount: poundsOutput }));
      $ouncesCell.html(this.templates.resultCell({ amount: ouncesOutput }));

      if (firstResult === true) {
        $ingredientInput
          .siblings(".input-group-addon")
          .find(".remove-ingredient")
          .removeClass("disabled");

        var $newRow = $(this.templates.inputRow());
        this.$table.prepend($newRow);
        this.ingredientRows.push(this.initRow($newRow));

        if (unit === "units") {
          $unitInput.val("");
        }
      }

      $ingredientInput.attr("disabled", "disabled");
    }
  };

  return app;
})(jQuery, utils);

$(function() {
  V2W.start();
});
