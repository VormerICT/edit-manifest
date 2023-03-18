var permissionsToRemove = [ "RECORD_AUDIO", "MODIFY_AUDIO_SETTINGS", "READ_PHONE_STATE" ];


var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];
var manifestFile = path.join(rootdir, "platforms/android/AndroidManifest.xml");

fs.readFile( manifestFile, "utf8", function( err, data )
{
    if (err)
        return console.log( err );

    var result = data;
    for (var i=0; i<permissionsToRemove.length; i++)
        result = result.replace( "&lt;uses-permission android:name=\"android.permission." + permissionsToRemove[i] + "\" /&gt;", "" );

    fs.writeFile( manifestFile, result, "utf8", function( err )
    {
        if (err)
            return console.log( err );
    } );
} );
