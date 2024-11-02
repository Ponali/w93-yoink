# Introduction
Yoink is a simple package manager made for [Windows93](https://windows93.net) that lets you install packages locally and from multiple mirrors.

Keep in mind this is still a work-in-progress! Some bugs may occur at random times, and if they do, please open an issue!

NOTE: File paths will be relative to the "local storage drive". In Windows93 V2, this drive is /a/. In Windows93 V3 however, this drive is on the root.

[Quick install](https://www.windows93.net/#!js%20data:text/plain;charset=utf-8;base64,JGxvYWRlcihbImh0dHBzOi8vZ2l0aHViLmNvbS9Qb25hbGkvdzkzLXlvaW5rL3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9pbnN0YWxsZXItcmVndWxhci5qcyJdKQ==) / [Quick Source install](https://www.windows93.net/#!js%20data:text/plain;charset=utf-8;base64,JGxvYWRlcihbImh0dHBzOi8vZ2l0aHViLmNvbS9Qb25hbGkvdzkzLXlvaW5rL3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9pbnN0YWxsZXItc291cmNlLmpzIl0p)

# Supported versions
As of right now, only version V2 is supported. There will be support for V3 soon, but the current version that is only accessible is an incomplete public beta, that doesn't have a boot folder or a terminal app.

# Setting up
To set up, you need to first obtain a Yoink installer program. Currently, there is a GitHub action that automatically makes Yoink installers upon a new release.
You can check in the Releases tab of this repository for a Yoink installer.

You can also click on one of the "Quick install" hyperlinks at the start of this README file to quickly install Yoink.

An installer is a standalone JavaScript file and only requires to be run on a supported version of Windows93 to install Yoink.

There are two types of Yoink installers:
- Regular installer (Installs Yoink immidiately, in minified form, reccomended for new users)
- Source installer (Installs the Yoink source code, reccomended for developpers)

If you would like to make an installer from the Yoink source code yourself, look at the very end of this README file.

# Using yoink
## Configuring mirrors
Before using Yoink with online packages, you need to configure mirrors and update them.

The mirror file is in `yoink/settings/mirrors.txt`. If you have any mirrors you know to add, please add them here.

Updating the mirrors can be done by entering `yoink -m` in the terminal. Once it finishes configuring mirrors, Yoink will now be able to install online packages.

## Installing a package
Installing a package can be done by running `yoink -i [packagename]`, but there's a direct way of doing so by running `yoink [packagename]`.
### Local install
This is for installing a package that is inside the current "local storage drive".

First, set the current terminal directory to the one where your package files resides on, using `cd [filepath]`. This ensures that Yoink can find the file correctly.

Once you are on the right path, run `yoink (-i) [packagename]`. Yoink will find the file regardless if you put `.ynk` at the end or not.
### Online install
Installing from online mirrors does not require you to go to a specific path. The only thing you need to do is to run `yoink (-i) [packagename]`.

**WARNINGS**:
- Adding `.ynk` at the end will make Yoink fail to find any file from any mirrors.
- Ensure that the current path you are on does not have a package file with the same name. If there is, Yoink is going to install the local file and won't check on any online mirrors.
- Ensure that you've already set up mirrors. (see "Configuring mirrors".)

## Removing a package
Removing a package can be done by running `yoink -r [packagename]`.

Removing orphaned packages afterwards can be done by adding the `-o` flag.

Installed packages can have "additional data" (or "save data"). This data can be removed by adding the `-a` flag.

*Tip*: You can remove all orphaned packages without any package names by running `yoink -ro(a)`.

## Update source code
**WARNING**: This will only work with "Source" versions of Yoink. It is unknown what will happen with a regular version of Yoink.

If you are developing Yoink with a "Source" version, there are moments where you will need to recompile Yoink once you're done editing the code that makes it.

To recompile Yoink, simply run `yoink -s` in the terminal.

### "Not ready" error
This happens when the code that got compiled and ran had an error, and hasn't returned an usable app.

When this happens, it's not possible to run `yoink -s` to recompile again.
You will have to re-run the boot script (Go to boot folder -> Right-click `yoink.js` -> "Open with..." -> Click "Run JS"), or reboot the computer and wait for the boot script to load.

# Developing Yoink
If you want to contribute to Yoink, do some bugfixing, and add features, you will need to get a "Source" version.
Source versions are versions of Yoink that run source code, and not a complex minified boot script.

When you install a Yoink "Source" version, there will be a folder called "run" in the "yoink" folder.
This "run" folder contains most of the source code made to run yoink, which will be compiled and ran by the boot script.

If you want to make some edits to Yoink, simply open the files, edit them, and recompile it. (see "Update source code")

# Making a Yoink mirror
Making a Yoink mirror is quite easy. The only requirements are:
- Server must at least have static content. No scripts are required.
- There must be a file called "yoink.txt" returning the http code "200 OK" or anything likewise. The content of this file doesn't matter.
- Server output must have CORS enabled for at least windows93.net or *.windows93.net
- Package files still end with `.ynk`, so if you are given a package file with the .ynk extension, do not rename it.
- All content must be accessible via HTTPS. (HTTP support is unknown and experimental.)

# Making an installer
## Regular installer
To make a regular installer, run the following commands:
```
cd installer  # Go to the installer directory
npm install  # Install all required modules
node make -o [filename]  # Wait a bit for it to make an installer.
```
The installer will appear as `[filename]`, relative to the installer directory. The installer will run on a supported version of Windows93 and will immidiately install Yoink for you.
## Source version installer
Source version installers are made from [w93-wizard-generator](https://github.com/Ponali/w93-wizard-generator), which explains the existence of the "wizgen-config" file on the root of this repo.

First, clone this repo and the w93-wizard-generator repo, go to the w93-wizard-generator directory, and run `node make ../w93-yoink -o yoink-source-installer.js`.
Once the program is done, a new file called `yoink-source-installer.js` gets made. This file doesn't require any other content, as it is standalone.
