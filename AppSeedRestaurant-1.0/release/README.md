# Restaurant Ionic
AppSeed Restaurant is a complete food ordering system for presenting a restaurant menu and accepting orders on the go. It comes with a powerful Self Hosted Administration Panel,  where restaurant owners can create/update their menu and prices, their business information and manage their orders.

## Run the app
Use `ionic serve` to run the app for a browser preview

or

use `ionic serve --lab` to run the app in a browser on two platforms at the same time.

### Add hooks
```bash
$ ionic hooks add
```

### Install plugins using package.json
The required plugins should be installed before any platform addition and build. This could be done by calling the `ionic state restore` command.

### Add a platform

```bash
$ ionic platform add ios
```

Supported Cordova platforms:

```bash
$ ionic platform add ios
$ ionic platform add android
```

### Create resources

```bash
$ ionic resources --default --force
```

### Build the app

```bash
$ ionic build ios
```

### Εmulate the app on simulator
iOS:

```bash
$ ionic emulate ios
```

Android:

```bash
$ ionic emulate android
```

For more information, see [Ionic Documentation](http://ionicframework.com/docs/).

### Plugins installation

Use the following commands and install all the plugins required by the app:
```bash
$ cordova plugin add {plugin id or url}
```

eg:

```bash
cordova plugin add cordova-plugin-inappbrowser
```

## Used Cordova plugins
In case that the required Cordova plugins are not installed while installing NodeJS dependencies, Cordova's command mentioned previously can be used to install the following plugins:

* **cordova-plugin-device** - This plugin defines a global device object, which describes the device's hardware and software.
* **cordova-plugin-console** - This plugin is meant to ensure that console.log() is as useful as it can be. It adds additional function for iOS, Ubuntu, Windows Phone 8, and Windows.
* **ionic-plugin-keyboard** - It provides functions to make interacting with the keyboard easier, and fires events to indicate that the keyboard will hide/show.
* **cordova-plugin-inappbrowser** - Provides a web browser view. It could be used to open images, access web pages, and open PDF files.
* **de.appplant.cordova.plugin.email-composer@0.8.2** - The plugin provides access to the standard interface that manages the editing and sending an email message.
* **cordova-plugin-geolocation** - Grab the current location of the user, or grab continuous location changes
* **SocialSharing-PhoneGap-Plugin** - Share images, text, messages via Facebook, Twitter, Email, SMS, WhatsApp, etc using this plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git).
* **cordova-plugin-whitelist** - This plugin implements a whitelist policy for navigating the application webview on Cordova 4.0
* **cordova-plugin-transport-security** - Cordova / PhoneGap Plugin to allow 'Arbitrary Loads' by adding a declaration to the Info.plist file to bypass the iOS 9 App Transport Security
* **cordova-plugin-network-information** - This plugin provides an implementation of an old version of the Network Information API. It provides information about the device's cellular and wifi connection, and whether the device has an internet connection.
* **cordova-plugin-globalization** - This plugin obtains information and performs operations specific to the user's locale, language, and timezone (https://github.com/apache/cordova-plugin-globalization.git).
* **cordova-plugin-sim** - This is a cordova plugin to get data from the SIM card like the carrier name, mcc, mnc and country code and other system dependent additional info (https://github.com/pbakondy/cordova-plugin-sim.git).

## Third Party Licences
* [Apache License](http://www.apache.org/licenses/)
* [MIT License](https://opensource.org/licenses/MIT)
