using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest("this is a bad request");
        }

        [HttpGet("Unauthorized")]
        public ActionResult GetAuthorized()
        {
            return Unauthorized();
        }

        [HttpGet("Validation-error")]
        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("Problem 1", "this is the first error");
            ModelState.AddModelError("Problem 2", "this is the second error");
            return ValidationProblem();
        }

        [HttpGet("server=error")]
        public ActionResult GetServerError()
        {
            throw new Exception("this is a server error");
        }
    }
}