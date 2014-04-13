<? require_once('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Convert volume measurements to weight for almost any ingredient. Converts US customary units to grams/pounds based on densities of ingredients.">
    <meta name="keywords" content="convert,volume,weight,ingredient,recipe,metric,units,measurement,free">
    <meta name="author" content="Green Ham Solutions LLC">
    <base href="/">
    <link rel="shortcut icon" href="assets/img/favicon.ico">

    <title>volum.io - free volume to weight converter</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="assets/css/v2w.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="assets/js/html5shiv.js"></script>
      <script src="assets/js/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="container">
      <div class="header row">
        <div class="col-md-4" id="branding">
          <a class="logo" href="/"><img src="assets/img/logo-32.png" align="left"></a>
          <h1 class="brand"><a href="/">volum.io</a></h1>
          <p class="small muted">free volume to weight converter</p>
        </div>
        <div class="col-md-8" id="header-ad">
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <!-- volum.io - Header (Responsive) -->
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6848900149610746"
               data-ad-slot="5592894314"
               data-ad-format="auto"></ins>
          <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>

      <div class="table-responsive">
        <table id="recipe-table" class="table table-striped">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Amount</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="text" id="ingredient" autocomplete="off" class="form-control input-sm" placeholder="Start typing an ingredient name..." title="Start typing an ingredient name..." data-toggle="tooltip">
              </td>
              <td>
                <input type="text" id="amount" autocomplete="off" size="3" class="form-control input-sm" title="Enter an amount to convert..." data-toggle="tooltip">
              </td>
              <td>
                <select id="unit" class="form-control input-sm" title="Select units to convert..." data-toggle="tooltip">
                  <optgroup label="US Volume">
                    <option value="t">t (teaspoons)</option>
                    <option value="T">T (tablespoons)</option>
                    <option value="floz">floz (fluid ounces)</option>
                    <option value="c" selected>c (cups)</option>
                    <option value="pt">pt (pints)</option>
                    <option value="qt">qt (quarts)</option>
                    <option value="gal">gal (gallons)</option>
                  </optgroup>
                  <optgroup label="Metric Volume">
                    <option value="ml">ml (milliliters)</option>
                    <option value="dl">dl (deciliters)</option>
                    <option value="l">l (liters)</option>
                  </optgroup>
                  <optgroup label="Weights">
                    <option value="oz">oz (ounces)</option>
                    <option value="lb">lb (pounds)</option>
                  </optgroup>
                </select>
              </td>
            </tr>
            <tr class="results-row success">
              <td colspan="3" class="conversion-result text-right">
                <span class="ingredient"></span>
                <span class="grams label label-info"></span>
                <span class="pounds label label-info"></span>
                <span class="ounces label label-info"></span>
                <button class="btn btn-xs btn-default" id="reset-btn">
                  <span class="glyphicon glyphicon-remove-circle"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p class="pull-right">
          &copy; <?= date('Y'); ?> <a href="https://greenhamsolutions.com" target="_blank"><img src="https://greenhamsolutions.com/favicon.ico"> Green Ham Solutions LLC</a>
        </p>
      </div>

    </div> <!-- /container -->


    <script src="assets/js/jquery-1.11.0.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/bootstrap3-typeahead.min.js"></script>
    <script src="assets/js/underscore.min.js"></script>
    <script src="assets/js/v2w.js"></script>

    <? if ($config['ga'] !== false): ?>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', '<?= $config['ga']['ua']; ?>', '<?= $config['ga']['domain']; ?>');
        ga('send', 'pageview');
      </script>
    <? endif; ?>
  </body>
</html>
