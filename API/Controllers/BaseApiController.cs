using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
        [ApiController] // ApiController means it will be a controller 
        [Route("api/[controller]")]  // route api/[conroller] means it will be name 
        public class BaseApiController:ControllerBase
        {
            
        }
    
}