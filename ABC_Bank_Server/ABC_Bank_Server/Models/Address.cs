using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ABC_Bank_Server.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string HomeAddress { get; set; }
        public int ContactId { get; set; }

        [JsonIgnore]
        public virtual Contact Contact { get; set; }
    }
}
