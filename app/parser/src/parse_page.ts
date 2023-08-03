import { Page } from 'playwright';

export interface ParsingConfig {
    [key: string]: string;
}

export interface Parser<T> {
    parsePage(page: Page, config: ParsingConfig): Promise<T[]>;
}
