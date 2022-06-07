using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T> // generic class extended 
    {
        #region public PagedList(List<T> items, int totalCount, int currentPage, int pageSize) --> ctor

/*
 * 
 */
        private PagedList(List<T> items, int totalCount, int currentPage, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = totalCount,
                PageSize = pageSize,
                CurrentPage = currentPage,
                TotalPages = (int) Math.Ceiling(totalCount / (double) pageSize)// 18/6 ---> 3 
            };
            AddRange(items); // adds to list of items 
            
        }

        #endregion


        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // gives a list of counted items. 
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            #region await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); formula calculatuin exampe
/*
 *    var count = await query.CountAsync(); // gives a list of counted items.  --> 18 count
 * int pageNumber--> 1 
 * int pageSize --> 6
 * var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            * 1 case 
     *           = await query.(Skip(1-1)*6).Take(6).toListAsync()
     *           = get 6 items
 *               =reminder is 12
 *           *2 cases
            *   = await query.(Skip(2-1)*6).Take(6).toListAsync()
    *           = get 6 items
 *              ==reminder is 6
 * 
 * 
 *             
 * 
 *             
 */
            

            #endregion
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }

        public MetaData MetaData { get; set; }
    }
}