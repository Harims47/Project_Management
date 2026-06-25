using AutoMapper;
using API.Entities;
using API.DTOs.v1.Account;
using API.DTOs.v1.Project;
using System;

namespace API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // 1. Account Mappings
            CreateMap<Account, AccountDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AccountId.ToString()))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AccountName));

            CreateMap<AccountCreateDto, Account>()
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.AccountId, opt => opt.MapFrom(_ => Guid.NewGuid()));

            CreateMap<AccountUpdateDto, Account>()
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Name));

            // 2. Project Mappings
            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProjectId.ToString()))
                .ForMember(dest => dest.ClientId, opt => opt.MapFrom(src => src.AccountId.ToString()))
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Account != null ? src.Account.AccountName : string.Empty))
                .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.Service != null ? src.Service.ServiceName : string.Empty))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : string.Empty))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate.ToString("yyyy-MM-dd")));

            CreateMap<ProjectCreateDto, Project>()
                .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.AccountId, opt => opt.MapFrom(src => Guid.Parse(src.ClientId)))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateTime.Parse(src.StartDate)))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateTime.Parse(src.EndDate)))
                // ServiceId and StatusId will be mapped manually in Service layer
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());

            CreateMap<ProjectUpdateDto, Project>()
                .ForMember(dest => dest.AccountId, opt => opt.MapFrom(src => Guid.Parse(src.ClientId)))
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateTime.Parse(src.StartDate)))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateTime.Parse(src.EndDate)))
                // ServiceId and StatusId will be mapped manually in Service layer
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());
        }
    }
}
