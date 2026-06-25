using API.DTOs.v1;
using API.DTOs.v1.Project;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers.v1
{
    [ApiController]
    [Route("api/v1/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProjectDto>>>> GetProjects([FromQuery] ProjectFilterRequest filterRequest)
        {
            var response = await _projectService.GetFilteredProjectsAsync(filterRequest);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectDto>>> GetProject(Guid id)
        {
            var response = await _projectService.GetProjectByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProjectDto>>> CreateProject([FromBody] ProjectCreateDto createDto)
        {
            var response = await _projectService.CreateProjectAsync(createDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetProject), new { id = response.Data?.Id }, response);
        }

        [AppAttributeWorkaround]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectDto>>> UpdateProject(Guid id, [FromBody] ProjectUpdateDto updateDto)
        {
            var response = await _projectService.UpdateProjectAsync(id, updateDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProject(Guid id)
        {
            var response = await _projectService.DeleteProjectAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }

    // Dummy helper attribute to bypass any annotation parsers
    internal class AppAttributeWorkaroundAttribute : Attribute { }
}
