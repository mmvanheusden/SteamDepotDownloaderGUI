using System;
using System.Drawing;
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
        //Strings
        string ChooseBox_PSW;
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
            Directory.SetCurrentDirectory("./DepotDownloader/");
            //Font Adding,creating,etc
            byte[] fontData = Properties.Resources.Poppins_Medium;
            IntPtr fontPtr = System.Runtime.InteropServices.Marshal.AllocCoTaskMem(fontData.Length);
            System.Runtime.InteropServices.Marshal.Copy(fontData, 0, fontPtr, fontData.Length);
            uint dummy = 0;
            fonts.AddMemoryFont(fontPtr, Properties.Resources.Poppins_Medium.Length);
            AddFontMemResourceEx(fontPtr, (uint)Properties.Resources.Poppins_Medium.Length, IntPtr.Zero, ref dummy);
            System.Runtime.InteropServices.Marshal.FreeCoTaskMem(fontPtr);
            Poppins = new Font(fonts.Families[0], 18.0F);
            labelTitle.Font = Poppins;
        }

        private void buttonDownload_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(textBoxAppID.Text) || string.IsNullOrEmpty(textBoxDepotID.Text) || string.IsNullOrEmpty(textBoxManifestID.Text))
            {
                MessageBox.Show("Please fill all required fields.");
            }
            else
            {
                FolderBrowserDialog folderDlg = new FolderBrowserDialog();
                DialogResult result = folderDlg.ShowDialog();
                if (result == DialogResult.OK & result != DialogResult.Cancel)
                {
                    string selectedpath = folderDlg.SelectedPath;
                    //The command
                    Command = $"/k dotnet DepotDownloader.dll -app {textBoxAppID.Text} -depot {textBoxDepotID.Text} -manifest {textBoxManifestID.Text} -max-servers {numericUpDownMaxServers.Value} -max-downloads {numericUpDownMaxChunks.Value} -dir " + '"' + selectedpath + '"' + " " + textBoxArgs.Text;
                    //First Checking if Password AND username is empty (Length is smaller or equal 0)
                    if (textBoxPassword.Text.Length <= 0 & textBoxUsername.Text.Length <= 0)
                    {
                        MessageBox.Show("No Username or Password, continue with Anonim");
                        //It will probably just continue,because no else state, and no need else state if nothing is there.
                    }
                    //IF has username,adding it
                    if (textBoxUsername.Text.Length > 0)
                    {
                        Command += $" -username { textBoxUsername.Text}";
                    }
                    //IF has Passowrd adding it
                    if (textBoxPassword.Text.Length > 0)
                    {
                        Command += $" -password { textBoxPassword.Text}";
                    }
                    //Note: remmeber password only works if has username.
                    //IF has username,and NOT has password, adding remember-password in the end.
                    //But you still can type it in the "Optional Argument"
                    if (textBoxUsername.Text.Length > 0 & ChooseBox_PSW != null & !textBoxArgs.Text.Contains("-remember-password") & textBoxPassword.Text.Length <= 0)
                    {
                        Command += ChooseBox_PSW;
                    }
                    //Open CMD with DepotDownloader Args
                    open("cmd.exe", Command);
                }
            }
        }
        private void open(string url, string args = "")
        {
            System.Diagnostics.Process.Start(url, args);
        }

        private void buttonHelp_Click(object sender, EventArgs e)
        {
            open("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/discussions/5");
        }

        private void buttonSearch_Click(object sender, EventArgs e)
        {
            string url = "https://steamdb.info/instantsearch/";
            string query = "?query=";
            if (textBoxAppID.Text.Length > 0) //It parse the ID-s too, not fixed
            {
                url += query + textBoxAppID.Text;
            }
            open(url);
        }

        private void buttonRepo_Click(object sender, EventArgs e)
        {
            open("https://github.com/mmvanheusden/SteamDepotDownloaderGUI");
        }

        private void RememberChanged(object sender, EventArgs e)
        {
            if (RemeberPassCheckBox.Checked)
            {
                ChooseBox_PSW = " -remember-password";
            }
            else
            {
                ChooseBox_PSW = null;
            }
        }

        private void textBoxAppID_MouseHover(object sender, EventArgs e)
        {
            string x = "You can type here a NAME of the App, then hit the instant Search"; //slejm broken english grammar, fix it if you can. Also remove this line too
            toolTip1.SetToolTip(textBoxAppID, x);
        }
    }
}
