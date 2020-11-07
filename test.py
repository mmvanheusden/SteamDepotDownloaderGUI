from tkinter import *


def show_data():
    global first
    global last
    first = fname.get()
    print(first)


win = Tk()
Label( win, text='First Name' ).grid( row=0 )
Label( win, text='Last Name' ).grid( row=1 )

fname = Entry( win )
lname = Entry( win )

fname.grid( row=0, column=1 )
lname.grid( row=1, column=1 )

Button( win, text='Exit', command=win.quit ).grid( row=3, column=0, sticky=W, pady=4 )
Button( win, text='Show', command=show_data ).grid( row=3, column=1, sticky=W, pady=4 )

mainloop()