// Global vars
var deferral, fs, elementtree, path;

var disableAllowBackup = (function () {

    var disableAllowBackup = {};

    var manifestPaths = {
        cordovaAndroid6: "platforms/android/AndroidManifest.xml",
        cordovaAndroid7: "platforms/android/app/src/main/AndroidManifest.xml"
    };

    var rootDir;

    disableAllowBackup.fileExists = function (filePath) {
        try {
            return fs.statSync(filePath).isFile();
        } catch (error) {
            return false;
        }
    };

    disableAllowBackup.parseElementtreeSync = function (filename) {
        var content = fs.readFileSync(filename, 'utf-8');
        return new elementtree.ElementTree(elementtree.XML(content));
    };

    disableAllowBackup.getAndroidManifestPath = function () {
        var cordovaAndroid6Path = path.join(rootDir, manifestPaths.cordovaAndroid6);
        var cordovaAndroid7Path = path.join(rootDir, manifestPaths.cordovaAndroid7);

        if (this.fileExists(cordovaAndroid6Path)) {
            return cordovaAndroid6Path;
        } else if (this.fileExists(cordovaAndroid7Path)) {
            return cordovaAndroid7Path;
        } else {
            return undefined;
        }
    };


    disableAllowBackup.apply = function (ctx) {
        debugger;
        rootDir = ctx.opts.projectRoot;

        var androidManifestPath = this.getAndroidManifestPath();
        if(!androidManifestPath) {
            throw new Error("Unable to find AndroidManifest.xml");
        }
        
        var manifestTree = this.parseElementtreeSync(androidManifestPath);
        var root = manifestTree.getroot();
        console.log("Parameter argv found ",process.argv);
        console.log("Parameter env found ",process.env);
        console.log("Object CTX = ",ctx);
        console.log("Array CTX.opts.options.argv = ",ctx.opts.options.argv);
        console.log("Array CTX.opts.cordova.plugins = ", ctx.opts.cordova.plugins);
        if (root) {
            var applicationElement = root.find("./application");
            if (applicationElement) {
                root.set("xmlns:tools", "http://schemas.android.com/tools");
                applicationElement.set("android:allowBackup", "false");
                applicationElement.set("tools:replace", "android:allowBackup");
            } else {
                throw new Error("Invalid AndroidManifest.xml structure. No <application> tag found.");
            }
            var usesPermission = root.find('./uses-permission[@android:name="android.permission.RECORD_AUDIO"]');
            if (applicationElement) {
                root.remove(usesPermission);
                console.log("Uses permission removed.");
            }
            else {
                console.log("No uses-permission found");
            }
            root.remove(usesPermission);
            fs.writeFileSync(androidManifestPath, manifestTree.write({indent:4}, 'utf-8'));
        } else {
            throw new Error("Invalid AndroidManifest.xml structure. No <manifest> tag found.");
        }
    };

    return disableAllowBackup;
})();

module.exports = function (ctx) {
    var Q = require('q');
    fs = require('fs');
    path = require('path');
    elementtree = require('elementtree');

    deferral = Q.defer();

    try {
        disableAllowBackup.apply(ctx);
        deferral.resolve();
    } catch (error) {
        deferral.reject(error);
        return deferral.promise;
    }

    return deferral.promise;
};
