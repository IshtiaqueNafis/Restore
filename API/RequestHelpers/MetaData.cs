﻿namespace API.RequestHelpers
{
    public class MetaData
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; } // total count of items for the avialble items. 
    }
}