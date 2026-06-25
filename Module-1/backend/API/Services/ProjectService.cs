using API.Data;
using API.DTOs.v1;
using API.DTOs.v1.Project;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProjectService(IProjectRepository repository, AppDbContext context, IMapper mapper)
        {
            _repository = repository;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<ProjectDto>>> GetFilteredProjectsAsync(ProjectFilterRequest filterRequest)
        {
            var query = _repository.GetQueryable()
                .Include(p => p.Account)
                .Include(p => p.Service)
                .Include(p => p.Status)
                .AsNoTracking();

            // 1. Account Filter
            if (!string.IsNullOrWhiteSpace(filterRequest.AccountId))
            {
                if (Guid.TryParse(filterRequest.AccountId, out var accId))
                {
                    query = query.Where(p => p.AccountId == accId);
                }
            }

            // 2. Search Text
            if (!string.IsNullOrWhiteSpace(filterRequest.Search))
            {
                var s = filterRequest.Search.Trim().ToLower();
                query = query.Where(p => p.ProjectCode.ToLower().Contains(s) ||
                                         p.ProjectName.ToLower().Contains(s) ||
                                         p.Manager.ToLower().Contains(s));
            }

            // 3. Multi-code lists
            if (!string.IsNullOrWhiteSpace(filterRequest.ProjectCodes))
            {
                var codes = filterRequest.ProjectCodes
                    .Split(new[] { ',', ' ', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(c => c.Trim().ToLower())
                    .ToList();

                if (codes.Any())
                {
                    query = query.Where(p => codes.Any(c => p.ProjectCode.ToLower().Contains(c)));
                }
            }

            // 4. Service capability line
            if (!string.IsNullOrWhiteSpace(filterRequest.Service))
            {
                var srv = filterRequest.Service.Trim();
                query = query.Where(p => p.Service.ServiceName == srv);
            }

            // 5. Status
            if (!string.IsNullOrWhiteSpace(filterRequest.Status))
            {
                var stat = filterRequest.Status.Trim();
                query = query.Where(p => p.Status.StatusName == stat);
            }

            // 6. Manager
            if (!string.IsNullOrWhiteSpace(filterRequest.Manager))
            {
                var mgr = filterRequest.Manager.Trim();
                query = query.Where(p => p.Manager == mgr);
            }

            // 7. Revenue limits
            if (filterRequest.RevenueMin.HasValue)
            {
                query = query.Where(p => p.Revenue >= filterRequest.RevenueMin.Value);
            }
            if (filterRequest.RevenueMax.HasValue)
            {
                query = query.Where(p => p.Revenue <= filterRequest.RevenueMax.Value);
            }

            // 8. Dates bounds
            if (!string.IsNullOrWhiteSpace(filterRequest.StartDate))
            {
                if (DateTime.TryParse(filterRequest.StartDate, out var sDate))
                {
                    query = query.Where(p => p.StartDate >= sDate);
                }
            }
            if (!string.IsNullOrWhiteSpace(filterRequest.EndDate))
            {
                if (DateTime.TryParse(filterRequest.EndDate, out var eDate))
                {
                    query = query.Where(p => p.EndDate <= eDate);
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filterRequest.SortColumn))
            {
                var isDesc = filterRequest.SortDirection?.ToLower() == "desc";
                query = filterRequest.SortColumn.ToLower() switch
                {
                    "projectcode" => isDesc ? query.OrderByDescending(p => p.ProjectCode) : query.OrderBy(p => p.ProjectCode),
                    "projectname" => isDesc ? query.OrderByDescending(p => p.ProjectName) : query.OrderBy(p => p.ProjectName),
                    "revenue" => isDesc ? query.OrderByDescending(p => p.Revenue) : query.OrderBy(p => p.Revenue),
                    "manager" => isDesc ? query.OrderByDescending(p => p.Manager) : query.OrderBy(p => p.Manager),
                    "service" => isDesc ? query.OrderByDescending(p => p.Service.ServiceName) : query.OrderBy(p => p.Service.ServiceName),
                    "status" => isDesc ? query.OrderByDescending(p => p.Status.StatusName) : query.OrderBy(p => p.Status.StatusName),
                    _ => query.OrderBy(p => p.ProjectCode)
                };
            }
            else
            {
                query = query.OrderBy(p => p.ProjectCode);
            }

            var totalCount = await query.CountAsync();
            var page = Math.Max(1, filterRequest.Page);
            var pageSize = Math.Max(1, filterRequest.PageSize);
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Fetch paginated results
            var projects = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<ProjectDto>>(projects);
            var pagination = new PaginationMetadata(page, pageSize, totalCount, totalPages);

            return ApiResponse<List<ProjectDto>>.CreateSuccess(dtos, "Projects retrieved successfully.", pagination);
        }

        public async Task<ApiResponse<ProjectDto>> GetProjectByIdAsync(Guid id)
        {
            var project = await _repository.GetQueryable()
                .Include(p => p.Account)
                .Include(p => p.Service)
                .Include(p => p.Status)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null)
            {
                return ApiResponse<ProjectDto>.CreateFailure("Project not found.", "Resource not found.");
            }

            var dto = _mapper.Map<ProjectDto>(project);
            return ApiResponse<ProjectDto>.CreateSuccess(dto);
        }

        public async Task<ApiResponse<ProjectDto>> CreateProjectAsync(ProjectCreateDto createDto)
        {
            var errors = ValidateProjectBusinessRules(createDto.ProjectCode, createDto.ProjectName, createDto.Service, createDto.Revenue, createDto.StartDate, createDto.EndDate);
            if (errors.Any())
            {
                return ApiResponse<ProjectDto>.CreateFailure(errors, "Validation failed.");
            }

            // Unique project code check
            var codeUpper = createDto.ProjectCode.Trim().ToUpper();
            if (await _context.Projects.AnyAsync(p => p.ProjectCode == codeUpper))
            {
                return ApiResponse<ProjectDto>.CreateFailure($"Project Code '{codeUpper}' already exists in the system.", "Validation failed.");
            }

            var project = _mapper.Map<Project>(createDto);
            project.ProjectCode = codeUpper;
            
            // Resolve foreign keys
            project.ServiceId = MapServiceToId(createDto.Service);
            project.StatusId = MapStatusToId(createDto.Status);

            project.CreatedBy = "System";
            project.UpdatedBy = "System";
            project.CreatedDate = DateTime.UtcNow;
            project.UpdatedDate = DateTime.UtcNow;
            project.IsActive = true;

            await _repository.AddAsync(project);
            await _context.SaveChangesAsync();

            // Reload entity to populate navigation links
            var reloaded = await _repository.GetQueryable()
                .Include(p => p.Account)
                .Include(p => p.Service)
                .Include(p => p.Status)
                .FirstAsync(p => p.ProjectId == project.ProjectId);

            var dto = _mapper.Map<ProjectDto>(reloaded);
            return ApiResponse<ProjectDto>.CreateSuccess(dto, "Project created successfully.");
        }

        public async Task<ApiResponse<ProjectDto>> UpdateProjectAsync(Guid id, ProjectUpdateDto updateDto)
        {
            var errors = ValidateProjectBusinessRules(updateDto.ProjectCode, updateDto.ProjectName, updateDto.Service, updateDto.Revenue, updateDto.StartDate, updateDto.EndDate);
            if (errors.Any())
            {
                return ApiResponse<ProjectDto>.CreateFailure(errors, "Validation failed.");
            }

            // Load tracking entity
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
            if (project == null)
            {
                return ApiResponse<ProjectDto>.CreateFailure("Project not found.", "Resource not found.");
            }

            // Unique project code check (excluding self)
            var codeUpper = updateDto.ProjectCode.Trim().ToUpper();
            if (await _context.Projects.AnyAsync(p => p.ProjectCode == codeUpper && p.ProjectId != id))
            {
                return ApiResponse<ProjectDto>.CreateFailure($"Project Code '{codeUpper}' already exists in the system.", "Validation failed.");
            }

            _mapper.Map(updateDto, project);
            project.ProjectCode = codeUpper;
            
            // Resolve foreign keys
            project.ServiceId = MapServiceToId(updateDto.Service);
            project.StatusId = MapStatusToId(updateDto.Status);

            project.UpdatedBy = "System";
            project.UpdatedDate = DateTime.UtcNow;

            _repository.Update(project);
            await _context.SaveChangesAsync();

            // Reload entity to populate navigation links
            var reloaded = await _repository.GetQueryable()
                .Include(p => p.Account)
                .Include(p => p.Service)
                .Include(p => p.Status)
                .FirstAsync(p => p.ProjectId == id);

            var dto = _mapper.Map<ProjectDto>(reloaded);
            return ApiResponse<ProjectDto>.CreateSuccess(dto, "Project updated successfully.");
        }

        public async Task<ApiResponse<bool>> DeleteProjectAsync(Guid id)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.ProjectId == id);
            if (project == null)
            {
                return ApiResponse<bool>.CreateFailure("Project not found.", "Resource not found.", false);
            }

            // Soft delete
            project.IsActive = false;
            project.UpdatedBy = "System";
            project.UpdatedDate = DateTime.UtcNow;

            _repository.Update(project);
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Project deleted successfully.");
        }

        // Helper business rules validator
        private List<string> ValidateProjectBusinessRules(string projectCode, string projectName, string service, decimal revenue, string startDateStr, string endDateStr)
        {
            var errs = new List<string>();

            // Project Code format check
            var code = projectCode.Trim().ToUpper();
            if (!Regex.IsMatch(code, "^[A-Z]+-[0-9]+$"))
            {
                errs.Add("Project Code must be in format LETTERS-NUMBERS (e.g. CR-1001), with exactly one hyphen and no spaces.");
            }
            else
            {
                // Service line prefix check
                var prefix = code.Split('-')[0];
                var prefixes = new Dictionary<string, string>
                {
                    { "Creative", "CR" },
                    { "Digital", "DG" },
                    { "Research", "RS" },
                    { "Video", "VD" }
                };

                if (prefixes.TryGetValue(service, out var expectedPrefix) && prefix != expectedPrefix)
                {
                    errs.Add($"Project Code prefix '{prefix}' does not match Service Line '{service}' (expected prefix '{expectedPrefix}').");
                }
            }

            // Name length validation
            if (projectName.Trim().Length < 3 || projectName.Trim().Length > 100)
            {
                errs.Add("Project Name must be between 3 and 100 characters.");
            }

            // Revenue range
            if (revenue <= 0)
            {
                errs.Add("Project Revenue must be strictly positive (> 0).");
            }

            // Date validation
            if (DateTime.TryParse(startDateStr, out var sDate) && DateTime.TryParse(endDateStr, out var eDate))
            {
                if (eDate < sDate)
                {
                    errs.Add("Project End Date cannot be before the Start Date.");
                }
            }
            else
            {
                errs.Add("Start Date and End Date must be in a valid date format.");
            }

            return errs;
        }

        private int MapServiceToId(string serviceName)
        {
            return serviceName switch
            {
                "Creative" => 1,
                "Digital" => 2,
                "Research" => 3,
                "Video" => 4,
                _ => throw new ArgumentException($"Invalid service name: {serviceName}")
            };
        }

        private int MapStatusToId(string statusName)
        {
            return statusName switch
            {
                "Completed" => 1,
                "Ongoing" => 2,
                "Pipeline" => 3,
                "Cancelled" => 4,
                _ => throw new ArgumentException($"Invalid status name: {statusName}")
            };
        }
    }
}
