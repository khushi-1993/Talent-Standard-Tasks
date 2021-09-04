using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = null;
            profile = (await _userRepository.GetByIdAsync(Id));

            var videoUrl = "";
            var cvUrl = "";
            var photoUrl = "";

            if (profile != null)
            {
                photoUrl = string.IsNullOrWhiteSpace(profile.ProfilePhoto)
                          ? ""
                          : await _fileService.GetFileURL(profile.ProfilePhotoUrl, FileType.ProfilePhoto);

                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                cvUrl = string.IsNullOrWhiteSpace(profile.CvName)
                          ? ""
                          : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);


                var contactDetail =  new TalentContactDetail
                {
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Email = profile.Email,
                    Phone = profile.Phone,
                };

                var skills = profile.Skills == null ? null : profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var languages = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();

                var education = profile.Education.Select(x => viewModelFromEducation(x)).ToList();

                var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();

                var experience = profile.Experience.Select(x => viewModelFromExperience(x)).ToList();

                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    ContactDetails = contactDetail,
                    Gender = profile.Gender,
                    MobilePhone = profile.MobilePhone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = photoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = profile.CvName,
                    CvUrl = cvUrl,
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Languages = languages,
                    Skills = skills,
                    Education = education,
                    Certifications = certifications,
                    Experience = experience
                };
                return result;
            }

            return null;
        }

        private object AddEducationViewModel(object x)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                if (model.Id != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(model.Id));
                    existingTalent.LinkedAccounts = model.LinkedAccounts;
                    existingTalent.Summary = model.Summary;
                    existingTalent.Description = model.Description;
                    existingTalent.FirstName = model.ContactDetails.FirstName;
                    existingTalent.LastName = model.ContactDetails.LastName;
                    existingTalent.Email = model.ContactDetails.Email;
                    existingTalent.Phone = model.ContactDetails.Phone;
                    existingTalent.Address = model.Address;
                    existingTalent.Nationality = model.Nationality;
                    existingTalent.MobilePhone = model.MobilePhone;
                    existingTalent.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
                    existingTalent.VisaExpiryDate = model.VisaExpiryDate;
                    existingTalent.VisaStatus = model.VisaStatus;
                    existingTalent.ProfilePhoto = model.ProfilePhoto;
                    existingTalent.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingTalent.VideoName = model.VideoName;
                    existingTalent.CvName = model.CvName;
                    existingTalent.Summary = model.Summary;
                    existingTalent.Description = model.Description;
                    existingTalent.LinkedAccounts = model.LinkedAccounts;
                    existingTalent.JobSeekingStatus = model.JobSeekingStatus;

                    var newLanguage = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var language = existingTalent.Languages.SingleOrDefault(x => x.Id == item.Id);
                        if (language == null)
                        {
                            language = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, language);
                        newLanguage.Add(language);
                    }
                    existingTalent.Languages = newLanguage;

                    var newSkills = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    existingTalent.Skills = newSkills;

                    var newEducation = new List<UserEducation>();
                    foreach (var item in model.Education)
                    {
                        var education = existingTalent.Education.SingleOrDefault(x => x.Id == item.Id);
                        if (education == null)
                        {
                            education = new UserEducation
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateEducationFromView(item, education);
                        newEducation.Add(education);
                    }
                    existingTalent.Education = newEducation;

                    var newCertification = new List<UserCertification>();
                    foreach (var item in model.Certifications)
                    {
                        var certification = existingTalent.Certifications.SingleOrDefault(x => x.Id == item.Id);
                        if (certification == null)
                        {
                            certification = new UserCertification
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateCertificationFromView(item, certification);
                        newCertification.Add(certification);
                    }
                    existingTalent.Certifications = newCertification;

                    var newExperience = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var experience = existingTalent.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString()
                            };
                        }
                        UpdateExperienceFromView(item, experience);
                        newExperience.Add(experience);
                    }
                    existingTalent.Experience = newExperience;

                    await _userRepository.Update(existingTalent);

                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURLToUpdate(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            Employer profile = null;
            var employerID = employerOrJobId;
            if (forJob)
            {
                var job = await _jobRepository.GetByIdAsync(employerOrJobId);
                employerID = job.EmployerID;
            }

            profile = await _employerRepository.GetByIdAsync(employerID);
            var talentList = _userRepository.GetQueryable().Skip(position).Take(increment).ToList();
                //Skip(position).Take(increment);

            if (profile != null)
            {
                var result = new List<TalentSnapshotViewModel>();

                foreach (var item in talentList)
                {
                    var photoId = "";
                    if (item.ProfilePhotoUrl != null)
                    {
                        photoId = item.ProfilePhotoUrl;
                    }

                    var videoUrl = "";
                    if (item.VideoName != null)
                    {
                        videoUrl = string.IsNullOrWhiteSpace(item.VideoName)
                                  ? ""
                                  : await _fileService.GetFileURL(item.VideoName, FileType.UserVideo);
                    }

                    var cvUrl = "";
                    if (item.CvName != null)
                    {
                        cvUrl = string.IsNullOrWhiteSpace(item.CvName)
                                  ? ""
                                  : await _fileService.GetFileURL(item.CvName, FileType.UserVideo);
                    }

                    var summary = "";
                    if (item.Summary != null)
                    {
                        summary = item.Summary;
                    }

                    // get current employment)
                    var currentEmployment = "";
                    if (item.Experience != null && item.Experience.Count > 0)
                    {
                        currentEmployment = item.Experience.First().Company;
                    }

                    var visa = "";
                    if (item.VisaStatus != null)
                    {
                        visa = item.VisaStatus;
                    }

                    // Hardcoded to Junior at the moment until source data 
                    var level = "not available";

                    List<string> skills = new List<string>();
                    if (item.Skills != null)
                    {
                        Console.WriteLine("Skills not null.");
                        skills = item.Skills.Select(aSkill => aSkill.Skill).ToList();
                        Console.WriteLine($"Count: {item.Skills.Count}");
                    }

                    var talentSnapshot = new TalentSnapshotViewModel
                    {
                        Id = item.Id,
                        Name = item.FirstName + ' ' + item.LastName,
                        PhotoId = photoId,
                        VideoUrl = videoUrl,
                        CVUrl = cvUrl,
                        CurrentEmployment = currentEmployment,
                        Level = level,
                        Skills = skills,
                        Summary = summary,
                        Visa = visa
                    };

                    result.Add(talentSnapshot);
                }

                return result;
            }

            return null;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Name = language.Language,
                Level = language.LanguageLevel,
                Id = language.Id,
                CurrentUserId = language.UserId
            };
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.Language = model.Name;
            original.LanguageLevel = model.Level;
            original.UserId = model.CurrentUserId;
        }
        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationName = model.CertificationName;
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationYear = model.CertificationYear;
        }
        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear
            };
        }

        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.InstituteName = model.InstituteName;
            original.Title = model.Title;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        protected AddEducationViewModel viewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id
            };
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        protected ExperienceViewModel viewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
