//Select
interface SelectTextOptions {
    label: string;
    value: any;
    sort?: number;
    sub?: SelectTextOptions[];
}

interface AutoSelectOptions {
    id: any, name: any
}