export interface Area {
    uuid: string;
    title: string;
    address: string;
    kind: string;
    delete: boolean;
    access: string | null;
    secret: string | null;
}