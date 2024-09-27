export interface State extends PageQuery {
    loading?: boolean;
    dialogVisible?: boolean;
    title?: string;
    apiFn?: undefined;
    downFn?: undefined;
    import?: boolean;
    downloadType?: string;
    projectLoading?: boolean;
    step: number;
}
