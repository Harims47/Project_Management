using API.DTOs.v1;
using API.DTOs.v1.Account;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers.v1
{
    [ApiController]
    [Route("api/v1/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AccountDto>>>> GetAccounts(
            [FromQuery] string? search,
            [FromQuery] string? sortColumn,
            [FromQuery] string? sortDirection)
        {
            var response = await _accountService.GetAllAccountsAsync(search, sortColumn, sortDirection);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<AccountDto>>> GetAccount(Guid id)
        {
            var response = await _accountService.GetAccountByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AccountDto>>> CreateAccount([FromBody] AccountCreateDto createDto)
        {
            var response = await _accountService.CreateAccountAsync(createDto);
            return CreatedAtAction(nameof(GetAccount), new { id = response.Data?.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<AccountDto>>> UpdateAccount(Guid id, [FromBody] AccountUpdateDto updateDto)
        {
            var response = await _accountService.UpdateAccountAsync(id, updateDto);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteAccount(Guid id)
        {
            var response = await _accountService.DeleteAccountAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}
