export type VehicleCategory = 'Todos' | 'SUV' | 'Sedan' | 'Hatchback' | 'Picape' | 'Elétrico' | 'Esportivo';

export type FuelType = 'Flex' | 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico';

export type TransmissionType = 'Automático' | 'Manual' | 'CVT' | 'Dupla Embreagem';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  yearModel: string; // e.g. "2024/2024"
  year: number;
  category: VehicleCategory;
  price: number;
  fipePrice: number;
  km: number;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  plateEnd: string;
  city: string;
  state: string;
  images: string[];
  featured?: boolean;
  tag?: string; // e.g. "Único Dono", "Garantia de Fábrica", "Super Oferta", "Oportunidade"
  cautelarApproved: boolean;
  warrantyMonths: number;
  
  // Technical specs
  engine: string; // e.g. "2.0 Turbo 184cv"
  powerHp: number;
  acceleration0to100: string; // e.g. "7.1s"
  topSpeed: string; // e.g. "240 km/h"
  trunkCapacityLiters: number;
  consumptionCity: string; // e.g. "10.5 km/l"
  consumptionHighway: string; // e.g. "14.2 km/l"
  
  // Features list
  features: string[];
  description: string;
}

export interface FilterState {
  searchQuery: string;
  category: VehicleCategory;
  brand: string;
  minPrice: number;
  maxPrice: number;
  maxKm: number;
  transmission: string;
  fuel: string;
  minYear: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'km-asc' | 'year-desc';
}

export interface TestDriveBooking {
  vehicleId: string;
  vehicleName: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  unit: string;
}

export interface SellCarFormData {
  brand: string;
  model: string;
  year: string;
  km: string;
  plate: string;
  condition: 'Excelente' | 'Bom' | 'Regular';
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  city: string;
}
