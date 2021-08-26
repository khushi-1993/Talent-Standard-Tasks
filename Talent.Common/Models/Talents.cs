using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Talent.Common.Contracts;

namespace Talent.Common.Models
{
    public class Talent: IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public Guid UId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string MobilePhone { get; set; }
        public bool IsMobilePhoneVerified { get; set; }
        public Address Address { get; set; }
        public string Nationality { get; set; }
        public string VisaStatus { get; set; }
        public JobSeekingStatus JobSeekingStatus { get; set; }
        public DateTime? VisaExpiryDate { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public List<UserLanguage> Languages { get; set; }
        public List<UserSkill> Skills { get; set; }
        public List<UserEducation> Education { get; set; }
        public List<UserCertification> Certifications { get; set; }
        public List<UserExperience> Experience { get; set; }
        public Location Location { get; set; }
        public string ProfilePhoto { get; set; }
        public string ProfilePhotoUrl { get; set; }
        public string VideoName { get; set; }
        public ICollection<TalentVideo> Videos { get; set; }
        public string CvName { get; set; }
        public LinkedAccounts LinkedAccounts { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Login Login { get; set; }
    }
}
