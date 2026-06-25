using API.DTOs.v1;
using API.DTOs.v1.Common;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _repository;

        public ServiceService(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<ApiResponse<List<DropdownItemDto>>> GetServicesDropdownAsync()
        {
            var services = await _repository.GetQueryable()
                .OrderBy(s => s.ServiceId)
                .ToListAsync();

            var dropdownItems = services.Select(s => new DropdownItemDto
            {
                Value = s.ServiceName,
                Label = s.ServiceName switch
                {
                    "Creative" => "Creative Capabilities",
                    "Digital" => "Digital Web Solutions",
                    "Research" => "Clinical & Scientific Research",
                    "Video" => "Rich Media & Video Productions",
                    _ => s.ServiceName
                }
            }).ToList();

            return ApiResponse<List<DropdownItemDto>>.CreateSuccess(dropdownItems);
        }
    }
}
