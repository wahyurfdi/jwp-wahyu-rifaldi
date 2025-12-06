<!DOCTYPE html>
<html lang="en" class="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ env('APP_NAME', 'Laravel') }}</title>

    @vite(['resources/js/app.js'])
</head>

<body class="antialiased">
    <div id="app"></div>
</body>

</html>
