using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Drawing.Text;

namespace DepotDownloaderGUI
{
    public partial class Form1 : Form
    {
        [System.Runtime.InteropServices.DllImport("gdi32.dll")]
        private static extern IntPtr AddFontMemResourceEx(IntPtr pbFont, uint cbFont,
            IntPtr pdv, [System.Runtime.InteropServices.In] ref uint pcFonts);

        private PrivateFontCollection fonts = new PrivateFontCollection();

        Font Poppins;

        string Command;
        public Form1()
        {
            InitializeComponent();
            byte[] fontData = Properties.Resources.Poppins_Medium;
            IntPtr fontPtr = System.Runtime.InteropServices.Marshal.AllocCoTaskMem(fontData.Length);
            System.Runtime.InteropServices.Marshal.Copy(fontData, 0, fontPtr, fontData.Length);
            uint dummy = 0;
            fonts.AddMemoryFont(fontPtr, Properties.Resources.Poppins_Medium.Length);
            AddFontMemResourceEx(fontPtr, (uint)Properties.Resources.Poppins_Medium.Length, IntPtr.Zero, ref dummy);
            System.Runtime.InteropServices.Marshal.FreeCoTaskMem(fontPtr);
            Poppins = new Font(fonts.Families[0], 18.0F);
            Directory.SetCurrentDirectory("./depotdownloader/");
            textBox2.PasswordChar = '*';
            label9.Font = Poppins;
        }


        private void button1_Click(object sender, EventArgs e)
        {
            if (textBox2.Text == "")
                Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir ../YourGame {textBox8.Text}";
            else
                Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -username {textBox1.Text} -password {textBox2.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir ../YourGame {textBox8.Text}";
            System.Diagnostics.Process.Start("cmd.exe", Command);
        }


        private void button2_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/discussions/5");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://steamdb.info/instantsearch/");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            System.Diagnostics.Process.Start("https://github.com/mmvanheusden/SteamDepotDownloaderGUI");
        }

    }
}
