import os
import threading
from tkinter import *
from tkinter import ttk

os.chdir("depotdownloader")
def test():
    os.system(
        f"start /wait cmd /k dotnet DepotDownloader.dll -app {apid} -depot {dpotid} -manifest {manid} -username {uname}"
        f" -password {pswd} -max-servers 50 -max-downloads 32 -dir ../DownloadedDepot")


def execute():
    global uname, pswd, apid, dpotid, manid
    uname = username.get()
    pswd = password.get()
    apid = appid.get()
    dpotid = depotid.get()
    manid = manifestid.get()
    threading.Thread(target=test).start()


window = Tk()
window.title("Steam® Depot Downloader")
window.geometry('375x225')
a = Label(window, text="username", font=('Arial', 14)).grid(row=0, column=0)
b = Label(window, text="password", font=('Arial', 14)).grid(row=1, column=0)
c = Label(window, text="App ID", font=('Arial', 14)).grid(row=2, column=0)
d = Label(window, text="Depot ID", font=('Arial', 14)).grid(row=3, column=0)
e = Label(window, text="Manifest ID", font=('Arial', 14)).grid(row=4, column=0)

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
btn = ttk.Button(window, text="Start Download", command=execute)
btn.grid(row=5, column=0)

window.mainloop()
