namespace API.RequestHelpers
{
    public class MetaData
    {
        public int CurrentPage { get; set; } // this hold the current page 
        public int TotalPages { get; set; } // this is the TotalPages
        public int PageSize { get; set; } // how big the PageSize going to be. 
        public int TotalCount { get; set; } // total count of items for the avialble items. 
    }
}