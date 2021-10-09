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
using System.Net;
using System.IO.Compression;

namespace DepotDownloaderGUI
{
    public partial class downloadGUI : Form
    {
        [System.Runtime.InteropServices.DllImport("gdi32.dll")]
        private static extern IntPtr AddFontMemResourceEx(IntPtr pbFont, uint cbFont,
            IntPtr pdv, [System.Runtime.InteropServices.In] ref uint pcFonts);

        private PrivateFontCollection fonts = new PrivateFontCollection();

        Font Poppins;

        string Command;
        public downloadGUI()
        {
            InitializeComponent();
            if (!Directory.Exists("DepotDownloader"))
            {
                //Download
                string Download = "https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.5/depotdownloader-2.4.5.zip";
                string zipname = "depotdownloader-2.4.5.zip";
                string extractPath = "DepotDownloader";
                WebClient ZipDownloader = new WebClient();
                ZipDownloader.DownloadFile(Download, zipname);
                //Extract
                ZipFile.ExtractToDirectory(zipname, extractPath);
                //Delete
                File.Delete(zipname);
            }
            byte[] fontData = Properties.Resources.Poppins_Medium;
            IntPtr fontPtr = System.Runtime.InteropServices.Marshal.AllocCoTaskMem(fontData.Length);
            System.Runtime.InteropServices.Marshal.Copy(fontData, 0, fontPtr, fontData.Length);
            uint dummy = 0;
            fonts.AddMemoryFont(fontPtr, Properties.Resources.Poppins_Medium.Length);
            AddFontMemResourceEx(fontPtr, (uint)Properties.Resources.Poppins_Medium.Length, IntPtr.Zero, ref dummy);
            System.Runtime.InteropServices.Marshal.FreeCoTaskMem(fontPtr);
            Poppins = new Font(fonts.Families[0], 18.0F);
            Directory.SetCurrentDirectory("./DepotDownloader/");
            //textBox2.PasswordChar = '*'; -Added into Designer
            label9.Font = Poppins;
            //FormBorderStyle = FormBorderStyle.FixedSingle; -Added into Designer
            //MaximizeBox = false; -Added into Designer
        }


        private void button1_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog folderDlg = new FolderBrowserDialog();
            DialogResult result = folderDlg.ShowDialog();
            if (result == DialogResult.OK & result != DialogResult.Cancel)
            {
                string selectedpath = folderDlg.SelectedPath;
                if (textBox2.Text.Length <= 0)
                {
                    //Todo Remember Password tick
                    //Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir ../YourGame {textBox8.Text}";
                    Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir " + '"' +  selectedpath + '"' + " " + textBox8.Text;
                }
                else
                {
                    Command = $"/k dotnet DepotDownloader.dll -app {textBox3.Text} -depot {textBox4.Text} -manifest {textBox5.Text} -username {textBox1.Text} -password {textBox2.Text} -max-servers {numericUpDown1.Value} -max-downloads {numericUpDown2.Value} -dir " + '"' + selectedpath + '"' + " " + textBox8.Text;
                }

                System.Diagnostics.Process.Start("cmd.exe", Command);
            }
            else
            {
                return;
            }
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
