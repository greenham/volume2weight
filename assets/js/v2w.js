$(function() {
  var densities;

  if (localStorage && localStorage.getItem('v2w-densities')) {
    densities = JSON.parse(localStorage.getItem('v2w-densities'));
  } else {
    densities = initData();
  }

  if (densities.length > 0) {
    startApp(densities);
  } else {
    // @todo handle gracefully
  }
});

function initData()
{
  $.post(
    'server.php',
    {action: "initData"},
    function (data) {
      if (data.status == 'success') {
        densities = data.data;
        if (localStorage) {
          localStorage.setItem('v2w-densities', JSON.stringify(densities));
        }
        return densities;
      } else if (data.status == 'error') {
        console.error(data.message);
        return [];
      }
    },
    'json'
  );
}

function startApp(densities)
{
  var $ingredientInput = $('input#ingredient');
  var $amountInput     = $('input#amount');
  var $unitSelect      = $('select#unit');
  var $convertBtn      = $('button#convert-btn');
  var $resetBtn        = $('button#reset-btn');

  var unitConversions = {
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

  var g_lb = 453;

  var ingredientNames = _.map(densities, function (item) {
    return item.name;
  });

  $ingredientInput.typeahead({
    source: ingredientNames,
    minLength: 3
  });

  var doConversion = function (e) {
    var $el = $(this);
    var ingredient = $ingredientInput.val();
    var amount = $amountInput.val();
    var unit = $unitSelect.children(':selected').val();

    if (ingredient.length === 0 || amount.length === 0) {
      return false;
    }

    // find density for this ingredient
    var density = _.find(densities, function (item) {
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
    }
  };

  /*$convertBtn.click(doConversion);*/
  $ingredientInput.blur(doConversion);
  $amountInput.blur(doConversion);
  $unitSelect.change(doConversion);

  $resetBtn.click(function (e) {
    $(this).parent().siblings('td.grams,td.pounds').html("");
    $ingredientInput.val("");
    $amount.val("");
  });

  $ingredientInput.focus();
}