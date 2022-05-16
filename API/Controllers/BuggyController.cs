using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        #region Name:GetNotFound() HTTpRequest:method-get function returns HttpRequest when nothing is found

        [HttpGet("not-found")]
        public ActionResult GetNotFound() => NotFound();

        #endregion


        #region Name:GetBadRequest() HTTpRequest:method-get function returns 400 bad request 

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() => BadRequest("this is a bad request");

        #endregion

        #region Name:GetAuthorized() HTTpRequest:method-get function sends when someone can not login

        [HttpGet("Unauthorized")]
        public ActionResult GetAuthorized()
        {
            return Unauthorized();
        }

        #endregion

        #region Name:GetValidationError() HTTpRequest:method-get function sends error when error happened 

        [HttpGet("Validation-error")] 
        public ActionResult GetValidationError() 
        {
            ModelState.AddModelError("Problem 1", "this is the first error");
            ModelState.AddModelError("Problem 2", "this is the second error");
            return ValidationProblem();
        }

        #endregion

        #region Name:GetServerError() HTTpRequest:method-get function sends  a server error

        [HttpGet("server-error")]
        public ActionResult GetServerError() => throw new Exception("this is a server error");

        #endregion
    }
}