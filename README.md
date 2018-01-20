# slackgametest

Description

## Install own (dev) server
### 1. Slack.
First of all, you'll need to create your own dev app on Slack. Let's call it Slacktestgame.
That is pretty easy. Go to Slack API pages and create an app. You don't have to take care of SSL certificates if you're going to develop your app in your own team. Slack allows to use apps via HTTP in your team only.

Ensure that your future webserver is accessible externally. Slack will use your
webserver externally even if your webserver is local.

Do the steps below in the Slack app settings.

1. Add an interactive component and set **Interactive Components** > **Request URL** to `http://<YOUR_EXTERNAL_IP_ADDRESS>/slacktestgame/actions`
2. Add a slack command and set **Slack Commands** > **Add New Command** > **Request URL** to `http://<YOUR_EXTERNAL_IP_ADDRESS>/slacktestgame/commands`
3. Set **OAuth And Permissions** > **Redirect URLs** to:
 - `http://<YOUR_EXTERNAL_IP_ADDRESS>/slacktestgame/authorize/complete`
 - // TODO: maybe `http://localhost/slacktestgame/authorize/complete`. Better to add both for now :)
4. Create a bot user under **Bot Users** tab.
5. Add permissions at **OAuth And Permissions** > **Scopes** > **Select Permission Scopes**. List of required permissions is located in `/controllers/authorize/apploop.js:authorizeRequest()->'scope'`. If some settings/permissions change in the future you can keep reinstalling the app.

Go to your project app. Copy `private.ts` and `public.ts` from `/credentials/example` directory into `/credentials`.
Set the following keys there:

##### public.ts:
- **useSSL**: false
- **protocol**: http
- **host**: localhost
- **client_id**: Get it in **Settings** > **Basic Information**
- **verification_token**: Get it in **Settings** > **Basic Information**

##### private.ts:
- **client_secret**: Get it in **Settings** > **Basic Information**

### 2. Firebase.
#### 2a. Fill credentials.
Create your own Firebase instance. Go to **Project Overview** > **Project Settings** >
**Service Accounts**. Generate *serviceAccount* file for **Firebase Admin SDK**
on **NodeJS** (**Generate New Private Key** button). In your `private.js`
file set `firebase.serviceAccount` to downloaded service account JSON.

Go to **Database** tab (under **Develop**) on Firebase. Copy database URL from there. In your `private.js` file
set `firebase.databaseURL` to this value.

#### 2b. Firebase client.
Install firebase client (if not installed). For that run the following command:

```
$ (sudo) npm install -g firebase-tools
```

Ensure `firebase` command is available in your command line

```
$ firebase --version
```

Then log into your Firebase account using:

```
$ firebase login [—interactive]
```

*Interactive flag could be important e.g. for Windows. On OSX it works without this flag.*


After login you can see a list of available Firebase projects bind to your account using:

```
$ firebase list
```

Select the right one using:

```
$ firebase use <project ID>
```

To deploy your application into Firebase use:

```
$ firebase deploy
```

from `/firebase` directory. Also, before first deployment you'll need to go to `/firebase/functions` and run:

```˚
$ npm install
```

You also can provide additional optional arguments. For example, to only deploy database schema:

```
$ firebase deploy —only database
```

See firebase-tools docs for more info and Firebase documentation.

#### 2c. Compile Firebase rules.
We use blaze_compiler to make Firebase rules readable and well-organised.
Install it as such:

```
$ npm install -g blaze_compiler
```

...and use it like this:

```
$ cd firebase/db
$ blaze database.rules.yaml
```

As a result *rules.json* file will be compiled which could be deployed to
Firebase now using:

```
$ firebase deploy --only database
```

### 3. Install game app in Slack team.
Turn on your local webserver. Go to the project directory and execute:

```
$ npm start
```

Then go to `http://<YOUR_EXTERNAL_IP_ADDRESS>/slacktestgame/authorize/request`. Install this app
in your team.
There could be problems if previously you was logged in via browser into
a different team. Log into your dev team for your Slack app in browser, and
then visit specified URL again.

Once you install the Slack app in your team run installation prompt app:

```
$ npm run configure
```

Ensure that your team appeared there and you are admin of it.
Now you can create a new game channel with its own game settings. Do it (Just do it!).
Ensure that newly created private channel appears in your team and the game app bot appears there as well.

### 4. GAME LOOP.

... TODO.

## Dev notes

#### Technologies/Tags:

- Typescript
- Firebase
- Firebase Admin SDK
- Firebase DB rules
- Blaze compiler for Firebase DB rules
- TSLint
- NodeJS
- ExpressJS framework
- Slack API

`TODO:` tsc installation and IDE setup? Mmm.. later.