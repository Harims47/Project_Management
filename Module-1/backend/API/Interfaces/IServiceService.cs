using API.DTOs.v1;
using API.DTOs.v1.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IServiceService
    {
        Task<ApiResponse<List<DropdownItemDto>>> GetServicesDropdownAsync();
    }
}
