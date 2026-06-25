using API.DTOs.v1;
using API.DTOs.v1.Common;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers.v1
{
    [ApiController]
    [Route("api/v1/services")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DropdownItemDto>>>> GetServices()
        {
            var response = await _serviceService.GetServicesDropdownAsync();
            return Ok(response);
        }
    }
}
