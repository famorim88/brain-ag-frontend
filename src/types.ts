export interface Culture {
    id: number;
    producer_id: number;
    crop_year: string;
    name: string;
}

export interface CultureCreate {
    id?:number,
    crop_year: string;
    name: string;
}

export interface Producer {
    id: number;
    cpf_cnpj: string;
    name: string;
    farm_name: string;
    city: string;
    state: string;
    total_area: number;
    agricultural_area: number;
    vegetation_area: number;
    cultures: Culture[]; // Produtor pode ter várias culturas
}

export interface ProducerCreate {
    id?:number,
    cpf_cnpj: string;
    name: string;
    farm_name: string;
    city: string;
    state: string;
    total_area: number;
    agricultural_area: number;
    vegetation_area: number;
    cultures?: CultureCreate[];
}

export interface ProducerUpdate {
    id?:number,
    cpf_cnpj: string;
    name?: string;
    farm_name?: string;
    city?: string;
    state?: string;
    total_area: number;
    agricultural_area: number;
    vegetation_area: number;
    cultures?: CultureCreate[];
}

export interface DashboardSummary {
    total_farms: number;
    total_hectares: number;
    farms_by_state: { [key: string]: number };
    cultures_summary: { [key: string]: number };
    area_by_soil_use: { agricultural: number; vegetation: number };
}