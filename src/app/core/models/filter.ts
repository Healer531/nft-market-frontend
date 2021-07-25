import { countOnDisplay } from '../../pages/catalog-page/catalog-page';

export interface Filter {
    keyWord: string,
    priceRange: number[],
    categories: string[],
    sortMethod: string,
    offset: number,
    limit: number,
}
