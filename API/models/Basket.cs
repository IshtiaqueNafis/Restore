using System.Collections.Generic;
using System.Linq;

namespace API.models
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } 
        public List<BasketItem> Items { get; set; } = new(); // means this will create a new item.  prevents undifned error.  //one to many 

        #region ***Additem((Product product, int quantity)) --> adds items to basket***

        public void AddItem(Product product, int quantity)
        {



            #region *** check if a product with same id is on the basket already or not*** 

            if (Items.All(item => item.ProductId != product.Id)) // check if any of the product matches AddItem
            {
                Items.Add(new BasketItem
                {
                    Product = product,
                    Quantity = quantity
                });
            }

            #endregion

            #region ***Updating existingItem***

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            
        }

        #endregion

        #endregion

        #region ***RemoveItem(int productId, int quantity) --> Remove items from basket***

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.Id == productId); // find the item 
            if (item == null) return; // means no item was there 
            item.Quantity -= quantity; // make the quantity decrease 

            #region ***Remove item if the quantity is zero***

            if (item.Quantity == 0)
            {
                Items.Remove(item);
                
            }
        }

        #endregion

        #endregion
    }
}