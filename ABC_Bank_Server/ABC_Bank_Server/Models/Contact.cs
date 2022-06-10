using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABC_Bank_Server.Models
{
    public class Contact //: IValidatableObject
    {

        public Contact()
        {
            Addresses = new HashSet<Address>();
            Phones = new HashSet<Phone>();
        }

        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }
        public string? SecondName { get; set; } = String.Empty;
        public virtual ICollection<Address> Addresses { get; set; }

        [NotMapped]
        public string? AddressesJson { get; set; }

        [Required]
        public DateTime Datebirth { get; set; }
        public virtual ICollection<Phone> Phones { get; set; }

        [NotMapped]
        public string? PhonesJson { get; set; }
        public byte[]? PhotoFileData { get; set; }
        public string? PhotoFileName { get; set; }

        [NotMapped]
        [MaxFileSize(4 * 1024 * 1024)]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png" })]
        public IFormFile? PhotoFile { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Datebirth > DateTime.Today)
            {
                yield return new ValidationResult($"The date of birth is not valid.",new[] { nameof(Datebirth) });
            }
        }
    }
}
