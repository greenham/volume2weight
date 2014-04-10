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
  var $amountInput = $('input#amount');
  var $unitSelect = $('select#unit');
  var $convertBtn = $('button#convert-btn');

  var unitConversions = {
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

  var ingredientNames = _.map(densities, function (item) {
    return item.name;
  });

  $ingredientInput.typeahead({
    source: ingredientNames,
    minLength: 3
  });

  $convertBtn.click(function (e) {
    var ingredient = $ingredientInput.val();
    var amount = $amountInput.val();
    var unit = $unitSelect.children(':selected').val();

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

    alert(amount + " " + unit + " of " + ingredient + " = " + grams.toFixed(2) + " grams");
  });
}