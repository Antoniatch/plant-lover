export interface IContextUser {
    id: string;
    name: string;
    iat: number;
}

export interface IContext {
    user?: IContextUser;
}
