import {
    AccountStatus,
    AmenitiesOnRealEstate,
    CurrencyCode,
    Image, ListingStatus, MaintenanceRequest, Message,
    PreferencesOnRealEstate,
    RealEstateType,
    Realtor, UserRole,
} from "@prisma/client";

export class Property {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string | null;
    description: string | null;
    lotSize: number | null;
    yearBuilt: number | null;
    realEstateType: RealEstateType | null;
    marketPrice: number | null;
    currency: CurrencyCode | null;
    images: Image[];
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    amenities: AmenitiesOnRealEstate[];
    preferences: PreferencesOnRealEstate[];
    documents: Document[];
    realtor: Realtor;
    realtorId: number;
    units: Unit[];
}

export class Unit {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    unitIdentifier: string | null;
    unitNumber: string | null;
    floor: number | null;
    unitSize: number | null;
    numOfFloors: number | null;
    numOfRooms: number | null;
    numOfBedrooms: number | null;
    numOfBathrooms: number | null;
    garages: number | null;
    amenities: AmenitiesOnRealEstate[];
    rentalPrice: number | null;
    currency: CurrencyCode | null;
    status: ListingStatus | null;
    documents: Document[];
    images: Image[];
    maintenanceRequests: MaintenanceRequest[];
    realEstateObject: Property;
    realEstateObjectId: number;
    leases: Lease[];
}

class Lease {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    rentalPrice: number | null;
    leaseLength: number | null;
    leaseTerms: string | null;
    currency: CurrencyCode | null;
    totalRentDue: number | null;
    rentPaid: number | null;
    lastPaymentDate: Date | null;
    documents: Document[];
    tenant: Tenant | null;
    tenantId: number | null;
    unit: Unit | null;
    unitId: number | null;
    realtor: Realtor;
    realtorId: number;
}

class Tenant {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    civilStatus: string | null;
    occupation: string | null;
    income: number | null;
    creditScore: number | null;
    user: User | null;
    userId: number | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    leases: Lease[];
    maintenanceRequests: MaintenanceRequest[];
}

class User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    dob: Date | null;
    currencyCode: CurrencyCode | null;
    documents: Document[];
    title: string | null;
    avatar: string | null;
    images: Image[];
    phone: string | null;
    website: string | null;
    company: string | null;
    bio: string | null;
    status: AccountStatus;
    role: UserRole | null;
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
    sentMessages: Message[];
    receivedMessages: Message[];
    realtor: Realtor | null;
    tenant: Tenant | null;
}