using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            string fileURL = await Task.Run(() => {
                return string.Join("/", id);
                //return string.Join("/", "http://localhost:60290/images", id);
            });

            return fileURL;
        }

        public async Task<string> GetFileURLToUpdate(string id, FileType type)
        {
            string fileURL = await Task.Run(() => {
                return string.Join("/", "http://localhost:60290/images", id);
            });

            return fileURL;
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            var uploads = Path.Combine(_environment.ContentRootPath, _tempFolder);
            var fileName = string.Empty;
            var newFileName = string.Empty;

            fileName = System.Net.Http.Headers.ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

            var myUniqueFileName = Convert.ToString(Guid.NewGuid());

            var FileExtension = Path.GetExtension(fileName);

            newFileName = myUniqueFileName + FileExtension;

            try
            {
                if (file.Length > 0)
                {
                    var filePath = Path.Combine(uploads, newFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        // Save the file
                        await file.CopyToAsync(fileStream);
                    }

                }
                return newFileName;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            var imagesFolderPath = Path.Combine(_environment.ContentRootPath, _tempFolder);
            var filePath = Path.Combine(_tempFolder, id);

            try
            {
                if (File.Exists(filePath))
                {
                    await Task.Run(() =>
                    {
                        File.Delete(filePath);
                        return true;
                    });
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
