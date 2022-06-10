using ABC_Bank_Server.Models;

namespace ABC_Bank_Server.Repository
{
    public interface IContactRepository
    {
        /// <summary>
        /// Get the list of contacts filtered by the passed parameters.
        /// If no parameters is passed then return all contact's
        /// </summary>
        /// <param name="name">Contact's name</param>
        /// <param name="address">Contact's adress</param>
        /// <param name="ageFrom">Initial age</param>
        /// <param name="ageTo">End age or Top limit age</param>
        /// <returns></returns>
        public Task<List<Contact>> FindContacts(string? name, string? address, int? ageFrom, int? ageTo);

        /// <summary>
        /// Prepare the contact's object to be inserted or updated in the DB by adding the photos, the adresses and the phones
        /// </summary>
        /// <param name="contact"> The contact to be inserted or updated</param>
        /// <param name="contactDb"> The existing db contact for update the adresses and the phones</param>
        /// <returns></returns>
        public Task<Contact> PrepareContact(Contact contact, Contact contactDb = null);

        /// <summary>
        /// Update contact addresses from the list by adding, modifying or deleting
        /// </summary>
        /// <param name="addressesDb">existing adresses list</param>
        /// <param name="addresses">adresses list to be updated</param>
        public void UpdateAdress(ICollection<Address>? addressesDb, ICollection<Address>? addresses);

        /// <summary>
        /// Update contact phones from the list by adding, modifying or deleting
        /// </summary>
        /// <param name="addressesDb">existing phones list</param>
        /// <param name="addresses">phones list to be updated</param>
        public void UpdatePhones(ICollection<Phone>? phonesDb, ICollection<Phone>? phones);
    }
}
