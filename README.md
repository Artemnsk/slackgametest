# slackgametest

Description

## Install own (dev) server
### 1. Slack.
At first you need to create your own dev app on Slack. Let it be Slacktestgame.
That is as easy as go to Slack API pages and create your app. You do not
want to take care of these SSL cerificates so you will develop in your own team -
Slack allows to use apps via HTTP in app's team only.

Ensure that your future webserver is accessible externally. Slack will use your
webserver externally doesn't matter your webserver is local.

Use your external IP address to set the following Slack credentials:

1. **Interactive Components** > **Request URL**
 - \<IP address\>/slacktestgame/actions
2. **Slach Commands** > **Add New Command** > **Request URL**
 - \<IP address\>/slacktestgame/commands
3. **OAuth&Permissions** > **Redirect URLs**
 - \<IP address\>/slacktestgame/authorize/complete
 - // TODO: maybe localhost/slacktestgame/authorize/complete. Better to add both for now :)

Go to your project app. Copy /credentials/example/private.js and
/credentials/example/public.js files into /credentials/private.js and
/credentials/public.js appropriately.
Set the following keys there:

##### public.js:
- **useSSL**: false
- **protocol**: http
- **host**: localhost
- **client_id**: Get it in **Settings** > **Basic Information**
- **verification_token**: Get it in **Settings** > **Basic Information**

##### private.js:
- **client_secret**: Get it in **Settings** > **Basic Information**

### 2. Firebase.
#### 2a. Fill credentials.
Create your own Firebase instance. Go to **Project Overview** > **Project Settings** >
**Service Accounts**. Generate *serviceAccount* file for **Firebase Admin SDK**
on **NodeJS**. Put this file into /credentials folder. In your *private.js* file
set **firebase.serviceAccount** to
**require('./serviceAccountFileName')**.

Go to **Database** tab on Firebase. Copy database URL there. In your *private.js* file
set **firebase.databaseURL** to this value.

#### 2b. Firebase client.
Install firebase client (if not installed). For that run the following command:

`$ (sudo) npm install -g firebase-tools`

Ensure firebase command is available in your command line

`$ firebase --version`

Then log into your firebase account using

`$ firebase login [—interactive]`

*Interactive flag could be important e.g. for Windows. On OSX it works without this flag.*


After log in you can see a list of available firebase projects bind to your account using

`$ firebase list`

Select right one using

`$ firebase use <project ID>`

Use

`$ firebase deploy`

to deploy your application into Firebase. You also can provide additional optional
arguments e.g.

`$ firebase deploy —only database`

to deploy database schema only. See firebase-tools docs for more info and Firebase
documentation.

#### 2c. Compile Firebase rules.
We use blaze_compiler to make Firebase rules readable and well-organised.
Install it

`$ npm install -g blaze_compiler`

...and use it like this:

`$ cd firebase/db`

`$ blaze database.rules.yaml`

As result *rules.json* file will be compiled which could be deployed to
Firebase now using

`$ firebase deploy --only database`

### 3. Install game app in Slack team.
Turn on your local webserver

`$ node index.js`

Then go to *\<IP address\>/slacktestgame/authorize/request*. Install this app
in your team.
There could be problems if previously you was logged in via browser in
different team. Log into browser into your dev team for your Slack app and
then visit specified URL again.

Once you install Slack app in your team run installation prompt app:

`$ node install/install.js`

Ensure that your team appeared here. Ensure that you are admin there.
Now you can create new game channel with it's own game settings. Do it.
Ensure that this private channel appears in team and game app bot appears there
as well.

### 4. GAME LOOP.

... TODO.