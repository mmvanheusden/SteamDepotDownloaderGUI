# Imports
import os
import threading
from tkinter import *
from tkinter import ttk
from webbrowser import open_new_tab as webopen

# go in depotdownloader folder
os.chdir("depotdownloader")


# define functions
def test():
    if pswd == "":
        os.system(
            f"start /wait cmd /k dotnet DepotDownloader.dll -app {apid} -depot {dpotid} -manifest {manid}"
            f" -max-servers 100 -max-downloads 65 -dir ../YourGame")
    else:
        os.system(
            f"start /wait cmd /k dotnet DepotDownloader.dll -app {apid} -depot {dpotid} -manifest {manid}"
            f" -username {uname} -password {pswd} -max-servers 100 -max-downloads 65 -dir ../YourGame")


def execute():
    global uname, pswd, apid, dpotid, manid
    uname = username.get()
    pswd = password.get()
    apid = appid.get()
    dpotid = depotid.get()
    manid = manifestid.get()
    threading.Thread(target=test).start()  # run the download on a different thread so that the program doesn't freeze.


def dbsite():
    webopen("https://steamdb.info/instantsearch/")


def ghsite():
    webopen("https://github.com/mmvanheusden/DepotDownloaderGUI")


def needhelp():
    webopen("https://github.com/mmvanheusden/DepotDownloaderGUI/discussions")


# draw the text
window = Tk()
window.title("Steam Depot Downloader")
window.geometry('375x225')
a = Label(window, text="Username", font=('Arial', 14)).grid(row=0, column=0)
b = Label(window, text="Password", font=('Arial', 14)).grid(row=1, column=0)
c = Label(window, text="App ID", font=('Arial', 14)).grid(row=2, column=0)
d = Label(window, text="Depot ID", font=('Arial', 14)).grid(row=3, column=0)
e = Label(window, text="Manifest ID", font=('Arial', 14)).grid(row=4, column=0)
f = Label(window, text="Useful Links:", font=('Arial', 13)).grid(row=5, column=1)

# draw the input fields
username = Entry(window, font=('Arial', 14))
username.grid(row=0, column=1)
password = Entry(window, show="*", font=('Arial', 14))
password.grid(row=1, column=1)
appid = Entry(window, font=('Arial', 14))
appid.grid(row=2, column=1)
depotid = Entry(window, font=('Arial', 14))
depotid.grid(row=3, column=1)
manifestid = Entry(window, font=('Arial', 14))
manifestid.grid(row=4, column=1)
steamdb = ttk.Button(window, text="SteamDB Instant Search", command=dbsite)
steamdb.grid(row=6, column=1)
github = ttk.Button(window, text="GitHub Repo", command=ghsite)
github.grid(row=7, column=1)
dload = ttk.Button(window, text="Start Download", command=execute)
dload.grid(row=5, column=0)
github = ttk.Button(window, text="Need Help?", command=needhelp)
github.grid(row=6, column=0)

# put everything in a loop
window.mainloop()
