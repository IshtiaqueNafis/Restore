using System.ComponentModel.DataAnnotations.Schema;

namespace API.models
{
    [Table("BasketItems")] // this renames the table. 
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; } 
        public Product Product { get; set; } // foreign key 

        public int BasketId { get; set; }
        
        public Basket Basket { get; set; } // foreign key. 
    }
}