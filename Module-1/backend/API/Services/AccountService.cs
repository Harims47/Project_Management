using API.Data;
using API.DTOs.v1;
using API.DTOs.v1.Account;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _repository;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AccountService(IAccountRepository repository, AppDbContext context, IMapper mapper)
        {
            _repository = repository;
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<AccountDto>>> GetAllAccountsAsync(string? search = null, string? sortColumn = null, string? sortDirection = null)
        {
            var query = _repository.GetQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(a => a.AccountName.ToLower().Contains(s) || 
                                         a.GlobalLead.ToLower().Contains(s) || 
                                         a.Region.ToLower().Contains(s));
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(sortColumn))
            {
                var isDesc = sortDirection?.ToLower() == "desc";
                query = sortColumn.ToLower() switch
                {
                    "name" => isDesc ? query.OrderByDescending(a => a.AccountName) : query.OrderBy(a => a.AccountName),
                    "globallead" => isDesc ? query.OrderByDescending(a => a.GlobalLead) : query.OrderBy(a => a.GlobalLead),
                    "region" => isDesc ? query.OrderByDescending(a => a.Region) : query.OrderBy(a => a.Region),
                    _ => query.OrderBy(a => a.AccountName)
                };
            }
            else
            {
                query = query.OrderBy(a => a.AccountName);
            }

            var accounts = await query.ToListAsync();
            var dtos = _mapper.Map<List<AccountDto>>(accounts);

            return ApiResponse<List<AccountDto>>.CreateSuccess(dtos);
        }

        public async Task<ApiResponse<AccountDto>> GetAccountByIdAsync(Guid id)
        {
            var account = await _repository.GetByIdAsync(id);
            if (account == null)
            {
                return ApiResponse<AccountDto>.CreateFailure("Account not found.", "Resource not found.");
            }

            var dto = _mapper.Map<AccountDto>(account);
            return ApiResponse<AccountDto>.CreateSuccess(dto);
        }

        public async Task<ApiResponse<AccountDto>> CreateAccountAsync(AccountCreateDto createDto)
        {
            var account = _mapper.Map<Account>(createDto);
            account.CreatedBy = "System";
            account.UpdatedBy = "System";
            account.CreatedDate = DateTime.UtcNow;
            account.UpdatedDate = DateTime.UtcNow;
            account.IsActive = true;

            await _repository.AddAsync(account);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<AccountDto>(account);
            return ApiResponse<AccountDto>.CreateSuccess(dto, "Account created successfully.");
        }

        public async Task<ApiResponse<AccountDto>> UpdateAccountAsync(Guid id, AccountUpdateDto updateDto)
        {
            // Load from context to enable EF tracking
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == id);
            if (account == null)
            {
                return ApiResponse<AccountDto>.CreateFailure("Account not found.", "Resource not found.");
            }

            _mapper.Map(updateDto, account);
            account.UpdatedBy = "System";
            account.UpdatedDate = DateTime.UtcNow;

            _repository.Update(account);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<AccountDto>(account);
            return ApiResponse<AccountDto>.CreateSuccess(dto, "Account updated successfully.");
        }

        public async Task<ApiResponse<bool>> DeleteAccountAsync(Guid id)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == id);
            if (account == null)
            {
                return ApiResponse<bool>.CreateFailure("Account not found.", "Resource not found.", false);
            }

            // Soft delete
            account.IsActive = false;
            account.UpdatedBy = "System";
            account.UpdatedDate = DateTime.UtcNow;

            _repository.Update(account);

            // Cascade soft delete projects
            var projects = await _context.Projects.Where(p => p.AccountId == id).ToListAsync();
            foreach (var p in projects)
            {
                p.IsActive = false;
                p.UpdatedBy = "System";
                p.UpdatedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.CreateSuccess(true, "Account and associated projects deleted successfully.");
        }
    }
}
