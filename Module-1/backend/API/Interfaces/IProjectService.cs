using API.DTOs.v1;
using API.DTOs.v1.Project;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IProjectService
    {
        Task<ApiResponse<List<ProjectDto>>> GetFilteredProjectsAsync(ProjectFilterRequest filterRequest);
        Task<ApiResponse<ProjectDto>> GetProjectByIdAsync(Guid id);
        Task<ApiResponse<ProjectDto>> CreateProjectAsync(ProjectCreateDto createDto);
        Task<ApiResponse<ProjectDto>> UpdateProjectAsync(Guid id, ProjectUpdateDto updateDto);
        Task<ApiResponse<bool>> DeleteProjectAsync(Guid id);
    }
}
