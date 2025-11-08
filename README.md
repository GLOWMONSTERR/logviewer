<div align="center">
    <h1>Modmail Log Viewer</h1>
    <strong><i>A simple webserver to view your selfhosted modmail logs.</i></strong>
    <br />
    <br />
    <a href="https://heroku.com/deploy?template=https://github.com/modmail-dev/logviewer">
      <img src="https://img.shields.io/badge/deploy_to-heroku-997FBC.svg?style=for-the-badge" alt="Deploy to Heroku"/>
    </a>
    <a href="https://discord.gg/etJNHCQ">
      <img src="https://img.shields.io/discord/515071617815019520.svg?label=Discord&logo=Discord&colorB=7289da&style=for-the-badge" alt="Support">
    </a>
    <a href="https://patreon.com/kyber">
      <img src="https://img.shields.io/badge/patreon-donate-orange.svg?style=for-the-badge&logo=Patreon" alt="Donate on Patreon">
    </a>
    <a href="https://www.python.org/downloads/">
      <img src="https://img.shields.io/badge/Made%20With-Python%203.9-blue.svg?style=for-the-badge&logo=Python" alt="Made with Python 3.9">
    </a>
    <a href="https://github.com/psf/black">
      <img src="https://img.shields.io/badge/Code%20Style-Black-black?style=for-the-badge" alt="Coding Style Black">
    </a>
    <a href="https://github.com/modmail-dev/logviewer/blob/master/LICENSE">
      <img src="https://img.shields.io/badge/license-agpl-e74c3c.svg?style=for-the-badge" alt="AGPL License">
    </a>
</div>

## What is this?

In order for you to view your self-hosted logs, you have to deploy this application. Before you deploy the application, create a config var named `MONGO_URI` and put your MongoDB connection URI from the previous section into the value slot. Take the URL of this app after you deploy it and input it as a config var `LOG_URL` in the Modmail bot app.

## Updating

You can automatically update the logviewer in your Heroku account whenever changes are made to this repo.

To enable auto-updates, fork this repo and [install the Pull app in your fork](https://github.com/apps/pull). Then go to the Deploy tab in your Heroku account, select GitHub and connect your fork. Turn on auto-deploy for the master branch.

## Self-Hosting Setup

The method of hosting the logviewer depends on your server configurations. 

Below are some general instructions to help you get started on a Linux machine.

### Prerequisites

- A [Python 3.9+ installation](https://www.python.org/downloads/) with `pip`
- `git` for your system

**Linux (Ubuntu example)**
```shell
sudo apt install software-properties-common python3.9 python3-dev python3-pip
```

**Windows (PowerShell)**

Install Python and Git with [winget](https://learn.microsoft.com/windows/package-manager/winget/) or grab the installers from their official websites:

```powershell
winget install --id Python.Python.3.11
winget install --id Git.Git
```

After installing, restart your terminal (or run `refreshenv` if you use Chocolatey) so the new paths are available.

If `pipenv` still isn't found afterwards, use the full module invocation instead of relying on the PATH:

```powershell
py -3.11 -m pipenv --version
```

That command should print the installed version. You can keep the `py -3.11 -m pipenv` prefix for any later pipenv command if you prefer.


### Deployment

Run the following shell commands:
```shell
git clone https://github.com/modmail-dev/logviewer
cd logviewer
python3 -m pip install pipenv
pipenv install
cp .env.example .env
```
On Windows PowerShell, use the `py` launcher instead of `python3` and `copy` instead of `cp`:

```powershell
py -3.11 -m pip install pipenv
py -3.11 -m pipenv install
copy .env.example .env
```
Edit the `.env` file (e.g. `nano .env`) and fill in your MongoDB connection URI.

> You can also customize the bind IP and port in the `.env` file.

#### If `pipenv install` fails while building `httptools`

Windows users sometimes see the following error when Pipenv installs the dependencies:

```
error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools"
```

That happens because `httptools` (one of Sanic's dependencies) needs a C compiler when no prebuilt wheel
is available for your Python version. Fix it with either option below, then rerun `py -3.11 -m pipenv install`:

- **Install the Microsoft C++ Build Tools.** Download the "Build Tools for Visual Studio" from
  <https://visualstudio.microsoft.com/visual-cpp-build-tools/>, run the installer, and select the
  "Desktop development with C++" workload. After installation, close and reopen PowerShell so the
  new environment variables load.
- **Or install a matching Python interpreter that already has a compatible wheel.** For example, the
  64-bit Python 3.11 installer from python.org ships wheels for `httptools 0.5.0`, so `py -3.11 -m pipenv install`
  succeeds without needing extra build tools.

Once the compiler or matching Python runtime is in place, rerun the install command and Pipenv will finish
setting up the virtual environment.

### Running in Visual Studio Code on Windows

1. Install [Visual Studio Code](https://code.visualstudio.com/) and add the official **Python** extension when prompted.
2. Open VS Code, choose **File → Open Folder…**, and select the cloned `logviewer` project folder.
3. Open the Command Palette (`Ctrl` + `Shift` + `P`) and run **Python: Select Interpreter**. Pick the entry that points to `.venv` inside the project. If no Pipenv environment is listed yet, open the VS Code terminal and run `py -3.11 -m pipenv install` first, then repeat the interpreter selection.
4. Use the built-in terminal (**Terminal → New Terminal**) and start an interactive Pipenv shell so all subsequent commands use the right environment:
   ```powershell
   py -3.11 -m pipenv shell
   ```
5. From that terminal, launch the site with:
   ```powershell
   pipenv run logviewer
   ```
   VS Code will keep the server running in the terminal; open `http://127.0.0.1:8000` in your browser to view the app. When you are done, press `Ctrl` + `C` in the terminal to stop it.

If you prefer one-click debugging, open the **Run and Debug** panel in VS Code, choose **create a launch.json**, and pick **Python → Module**. Set the module name to `logviewer` and the working directory to the project root so the debugger uses the same command as above.

Then to start the app, run:
```shell
pipenv run logviewer
```

You can verify the logviewer is working by navigating to `http://<IP_OF_SERVER>:8000` (if you didn't change the bind IP / port) and should be greeted with the Logviewer main page.

To run the program in the background, you can use `screen`. Or you can use a service manager, such as `systemd`, which can also auto-restart the logviewer on failure and after system reboot.

### Advanced

We recommend setting up Nginx reverse proxy to port forward external port 80 to your internal logviewer port and cache static web contents ([tutorial](https://www.hostinger.com/tutorials/how-to-set-up-nginx-reverse-proxy/)).

To accept requests from a domain instead of your server IP, simply set an `A`/`AAAA` record from your DNS record manager that forwards your domain to your server IP.

## Discord OAuth2 

Protecting your logs with a login (Discord Oauth2 support) is a premium feature, only available to [Patrons](https://patreon.com/kyber).

## Contributing

If you can make improvements in the design and presentation of logs, please make a pull request with changes.
