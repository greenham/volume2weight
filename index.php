<? require_once('app/configs/routing.php'); ?>

<? require_once('app/configs/config.php'); ?>

<? require_once('app/views/layout/head.php'); ?>

  <body>

    <div class="container">
      <? require_once('app/views/layout/header.php'); ?>

      <? require_once("app/views/pages/{$page}.php"); ?>

      <? require_once('app/views/layout/footer.php'); ?>
    </div>


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
