using System.Collections.Generic;

namespace API.DTOs.v1
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "Request completed successfully.";
        public T? Data { get; set; }
        public PaginationMetadata? Pagination { get; set; }
        public List<string> Errors { get; set; } = new();

        public static ApiResponse<T> CreateSuccess(T data, string message = "Request completed successfully.", PaginationMetadata? pagination = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Pagination = pagination
            };
        }

        public static ApiResponse<T> CreateFailure(List<string> errors, string message = "Request failed.", T? data = default)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = data,
                Errors = errors
            };
        }

        public static ApiResponse<T> CreateFailure(string error, string message = "Request failed.", T? data = default)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Data = data,
                Errors = new List<string> { error }
            };
        }
    }

    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse CreateSuccess(object data, string message = "Request completed successfully.")
        {
            return new ApiResponse
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse CreateFailure(List<string> errors, string message = "Request failed.")
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors
            };
        }

        public static ApiResponse CreateFailure(string error, string message = "Request failed.")
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error }
            };
        }
    }

    public class PaginationMetadata
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }

        public PaginationMetadata(int page, int pageSize, int totalCount, int totalPages)
        {
            Page = page;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = totalPages;
        }
    }
}
