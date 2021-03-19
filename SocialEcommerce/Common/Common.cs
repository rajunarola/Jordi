using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialEcommerce.WebAPI.Common
{
    public class Message
    {
            public bool isSuccess { get; set; }
            public string message { get; set; }
            public object jsonObj { get; set; }
            public int totalCount { get; set; }
    }

    public class AsapResponse<T> where T : class
    {
        public bool isSuccess { get; set; }
        public string message { get; set; }
        public T jsonObj { get; set; }
        public long totalCount { get; set; }
    }
}
