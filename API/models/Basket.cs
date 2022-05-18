using System.Collections.Generic;
using System.Linq;

namespace API.models
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        #region ***Additem((Product product, int quantity)) --> adds items to basket***

        public void Additem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id)) // check if any of the product matches AddItem
            {
                Items.Add(new BasketItem
                {
                    Product = product,
                    Quantity = quantity
                });

                var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
            }
        }

        #endregion

        #region ***RemoveItem(int productId, int quantity) --> Remove items from basket***

        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.Id == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if (item.Quantity == 0)
            {
                Items.Remove(item);
                
            }
        }

        #endregion
    }
}