using System;
using System.Linq;
using System.Threading.Tasks;
using API.data;
using API.DTO;
using API.models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }


        #region ***Task<ActionResult<Basket>> GetBasket()***--->get Baskets-->method:get().

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrievedBasket();
            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }

        #endregion

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrievedBasket();
            if (basket == null)
            {
                basket = CreateBasket();
            }

            // ReSharper disable once HeapView.BoxingAllocation
            Product product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails {Title = "Product not found"});
            basket.AddItem(product, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto((basket)));

            return BadRequest(new ProblemDetails {Title = "problem saving"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            var basket = await RetrievedBasket();
            if (basket == null) return NotFound();
            basket.RemoveItem(productId, quantity);


            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "problem removing product"});
        }

        #region ***Task<ActionResult<Basket>> RetriveBasket() ---> retrive baskets***

        private async Task<Basket> RetrievedBasket() // no actionresults here since this is a normal method. 
            =>
                await _context.Baskets.Include(i => i.Items)
                    .ThenInclude(p => p.Product)
                    .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);

        #endregion

        #region ***CreateBasket()*** -->creates a basket if there is no empty basket

        private Basket CreateBasket()
        {
            #region ***creating buyer id ***

            string buyerId = Guid.NewGuid().ToString(); // creates lobally unique identifier.
            CookieOptions cookieOptions = new CookieOptions {IsEssential = true, Expires = DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions); // adds to server 

            #endregion

            Basket basket = new Basket {BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }

        #endregion


        #region MapBasketToDto(Basket basket) --> map basket DTO

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

        #endregion
    }
}