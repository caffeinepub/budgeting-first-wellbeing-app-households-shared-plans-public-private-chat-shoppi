import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Budget {
    expenses: number;
    goals: string;
    netIncome: number;
}
export interface PublicProfile {
    username: string;
    avatar?: ExternalBlob;
}
export type Time = bigint;
export interface PrivateProfile {
    dob: DateOfBirth;
    createdAt: Time;
    lastUpdated: Time;
    fullName: string;
    isAdult: boolean;
    avatar?: ExternalBlob;
}
export interface DateOfBirth {
    day: bigint;
    month: bigint;
    year: bigint;
}
export interface FullProfile {
    privateDetails?: PrivateProfile;
    publicProfile: PublicProfile;
}
export interface HouseholdInvite {
    status: Variant_pending_accepted_declined;
    inviterUsername: string;
    invitee: Principal;
    inviter: Principal;
    createdAt: Time;
    inviteeUsername: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_accepted_declined {
    pending = "pending",
    accepted = "accepted",
    declined = "declined"
}
export interface backendInterface {
    acceptHouseholdInvite(inviteId: string): Promise<string>;
    allUsernames(): Promise<Array<string>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(username: string, fullName: string, dob: DateOfBirth): Promise<PublicProfile>;
    declineHouseholdInvite(inviteId: string): Promise<void>;
    getAllProfilesByUsername(): Promise<Array<[string, PublicProfile]>>;
    getAllPublicProfiles(): Promise<Array<PublicProfile>>;
    getAllUsersAsStaff(): Promise<Array<[string, PublicProfile, PrivateProfile | null]>>;
    getAvatar(username: string): Promise<ExternalBlob | null>;
    getBudgetByUsername(username: string): Promise<Budget | null>;
    getCallerUserProfile(): Promise<FullProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingInvites(): Promise<Array<[string, HouseholdInvite]>>;
    getPersonalBudget(): Promise<Budget | null>;
    getPrivateProfileAsStaff(userPrincipal: Principal): Promise<PrivateProfile | null>;
    getPublicProfile(username: string): Promise<PublicProfile>;
    getUserProfile(userPrincipal: Principal): Promise<FullProfile>;
    inviteToHousehold(inviteeUsername: string): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(fullName: string, dob: DateOfBirth): Promise<void>;
    savePersonalBudget(budget: Budget): Promise<void>;
    uploadProfilePicture(blob: ExternalBlob): Promise<void>;
}
