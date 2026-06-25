using API.DTOs.v1;
using API.DTOs.v1.Account;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IAccountService
    {
        Task<ApiResponse<List<AccountDto>>> GetAllAccountsAsync(string? search = null, string? sortColumn = null, string? sortDirection = null);
        Task<ApiResponse<AccountDto>> GetAccountByIdAsync(Guid id);
        Task<ApiResponse<AccountDto>> CreateAccountAsync(AccountCreateDto createDto);
        Task<ApiResponse<AccountDto>> UpdateAccountAsync(Guid id, AccountUpdateDto updateDto);
        Task<ApiResponse<bool>> DeleteAccountAsync(Guid id);
    }
}
