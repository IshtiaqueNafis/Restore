using System.Collections.Generic;
using System.Linq;
using API.models;

namespace API.Extensions
{
    public static class ProductExtensions // will extend functionalty. 
    {
        #region ***static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) *** orders product 

        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)

            #region *** IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)*** explained

/*IQueryable -->An IQueryable is not actually a collection of entities, rather it describes how to obtain that collection
 * this IQueryable<Product> query, --> this extends the functuonality so it can be used
 */

            #endregion

        {
            if (string.IsNullOrWhiteSpace(orderBy))
            {
                return query.OrderBy(p => p.Name);
            }

            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };
            return query;
        }
        

        #endregion

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return query; // this means only the original will reutrn
            }

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower(); // lowers the search term case 

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm)); 
        }
        
        
    }
    
    
    
}