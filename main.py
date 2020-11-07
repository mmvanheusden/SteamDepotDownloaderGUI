from tkinter import *
from tkinter import ttk

def execute():
    uname = username.get()
    print(uname)
    pswd = password.get()
    print(pswd)

window = Tk()
window.title("Steam® Depot Downloader")
window.geometry('400x400')
a = Label(window, text="username", font=('Arial', 14)).grid(row=0, column=0)
b = Label(window, text="password", font=('Arial', 14)).grid(row=1, column=0)
c = Label(window, text="App ID", font=('Arial', 14)).grid(row=2, column=0)
d = Label(window, text="Depot ID", font=('Arial', 14)).grid(row=3, column=0)
e = Label(window, text="Manifest ID", font=('Arial', 14)).grid(row=3, column=0)

username = Entry(window, font=('Arial', 14))
username.grid(row=0, column=1)
password = Entry(window, show="*", font=('Arial', 14))
password.grid(row=1, column=1)
appid = Entry(window, font=('Arial', 14))
appid.grid(row=2, column=1)
depotid = Entry(window, font=('Arial', 14))
depotid.grid(row=3, column=1)
btn = ttk.Button(window, text="Start Download", command=execute)
btn.grid(row=4, column=0)


window.mainloop()
