<!DOCTYPE html>
<html>
    <head>
        <title>Worker Control Panel</title>

        <link rel="stylesheet" href="{{asset('css/all.css')}}">

        <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        @if ( Config::get('app.debug') )
          <script type="text/javascript">
            document.write('<script src="//localhost:35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
          </script>
        @endif
    </head>
    <body>
        <div class="container">
          @yield('content')
        </div>
        <script src="{{asset('js/bundle.js')}}"></script>
    </body>
</html>
