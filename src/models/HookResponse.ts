interface HookResponse<ResponseItems> {
    items: ResponseItems;
    currentPage?: number;
    hasNextPage?: number;
    hasPrevPage?: number,
    nextPage?: number,
    prevPage?: number,
    lastPage?: number,
    total?: number,
}

export default HookResponse