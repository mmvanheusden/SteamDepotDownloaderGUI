# Imports
import os
import threading
from tkinter import *
from tkinter import ttk
from webbrowser import open_new_tab as webopen

# go in depotdownloader folder
os.chdir("depotdownloader")


# define functions
def download():
    if pswd == "":
        os.system(
            f"start /wait cmd /k dotnet DepotDownloader.dll -app {apid} -depot {dpotid} -manifest {manid}"
            f" -max-servers {maxdload} -max-downloads {chunks} -dir ../YourGame {arg}")
    else:
        os.system(
            f"start /wait cmd /k dotnet DepotDownloader.dll -app {apid} -depot {dpotid} -manifest {manid}"
            f" -username {uname} -password {pswd} -max-servers {maxdload} -max-downloads {chunks} -dir ../YourGame {arg}")


def execute():
    global uname, pswd, apid, dpotid, manid, arg, chunks, maxdload
    uname = username.get()
    pswd = password.get()
    apid = appid.get()
    dpotid = depotid.get()
    manid = manifestid.get()
    arg = arguments.get()
    chunks = maxchunks.get()
    maxdload = maxservers.get()
    threading.Thread(target=download).start()  # run the download on a different thread so that the program doesn't freeze.


def dbsite():
    webopen("https://steamdb.info/instantsearch/")


def ghsite():
    webopen("https://github.com/mmvanheusden/DepotDownloaderGUI")


def needhelp():
    webopen("https://github.com/mmvanheusden/DepotDownloaderGUI/discussions")


# draw the text
window = Tk()
window.title("Steam Depot Downloader")
window.geometry('400x278')
window.resizable(width=False, height=False)
a = Label(window, text="Username", font=('Arial', 14)).grid(row=0, column=0)
b = Label(window, text="Password", font=('Arial', 14)).grid(row=1, column=0)
c = Label(window, text="App ID", font=('Arial', 14)).grid(row=2, column=0)
d = Label(window, text="Depot ID", font=('Arial', 14)).grid(row=3, column=0)
e = Label(window, text="Manifest ID", font=('Arial', 14)).grid(row=4, column=0)
f = Label(window, text="Max Servers", font=('Arial', 14)).grid(row=5, column=0)
g = Label(window, text="Max Chunks", font=('Arial', 14)).grid(row=6, column=0)
h = Label(window, text="Useful Links:", font=('Arial', 13)).grid(row=8, column=0)
i = Label(window, text="Optional Arguments", font=('Arial', 14)).grid(row=7, column=0)

# draw the input fields
username = Entry(window, font=('Arial', 14))
username.grid(row=0, column=1)
password = Entry(window, show='🤫', font=('Arial', 14))
password.grid(row=1, column=1)
appid = Entry(window, font=('Arial', 14))
appid.grid(row=2, column=1)
depotid = Entry(window, font=('Arial', 14))
depotid.grid(row=3, column=1)
manifestid = Entry(window, font=('Arial', 14))
manifestid.grid(row=4, column=1)
maxservers = Spinbox(window,from_=20,to=10000,font=('Arial', 13))
maxservers.grid(row=5, column=1)
maxchunks = Spinbox(window,from_=8,to=10000,font=('Arial', 13))
maxchunks.grid(row=6, column=1)
arguments = Entry(window, font=('Arial', 14))
arguments.grid(row=7, column=1)
steamdb = ttk.Button(window, text="SteamDB Instant Search", command=dbsite)
steamdb.grid(row=8, column=0)
github = ttk.Button(window, text="GitHub Repo", command=ghsite)
github.grid(row=9, column=0)
github = ttk.Button(window, text="Need Help?", command=needhelp)
github.grid(row=8, column=1)
dload = Button(window, text="Start Download", command=execute, bg='#97a8fc')
dload.grid(row=9, column=1)

# put everything in a loop
window.mainloop()
